"use client";

import { InputField } from "./CreateTutorialInputField";
import { CreateUnitsContainer } from "./CreateUnitsContainer";
import { useEffect, useRef, useState } from "react";
import {
  getTutorialById,
  createTutorial,
  updateTutorial,
  useMutation,
  useQuery,
} from "@repo/gql";
import { RootState, useSelector } from "@repo/reduxSetup";
import { ForwardRefEditor, type MDXEditorMethods } from "@repo/mdxSetup";
import { useRouter } from "next/navigation";

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

export function CreateTutorialPage({ tutorialId }: { tutorialId?: string }) {
  const [isMetaOpen, setIsMetaOpen] = useState(true);
  const [isUnitsOpen, setIsUnitsOpen] = useState(true);

  const editorRef = useRef<MDXEditorMethods>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.authSlice);

  const router = useRouter();

  const { data: tutorialData } = useQuery({
    queryKey: ["tutorialById", tutorialId],
    queryFn: () => getTutorialById(tutorialId!),
    enabled: !!tutorialId,
  });

  const [tutorialDetailes, setTutorialDetails] = useState({
    tutorialName: tutorialData?.tutorialName ?? "",
    author: user?.sub,
    category: tutorialData?.category ?? "",
    description: tutorialData?.description ?? "",
    level: tutorialData?.level ?? "",
    thumbnail: tutorialData?.thumbnail ?? "",
    publish: tutorialData?.publish ?? false,
  });

  const [units, setUnits] = useState<
    { id: string, unitTitle: string; order: number; content: string; publish: boolean }[]
  >(tutorialData?.units.map((u: any) => ({
    id: u.id,
    unitTitle: u.unitTitle,
    order: u.order,
    content: u.content,
    publish: u.publish
  }))
    || []);

  const [activeUnit, setActiveUnit] = useState<{
    id?: string;
    unitTitle: string;
    order: number;
    content: string;
    publish: boolean;
  } | null>(null);

  useEffect(() => {
    if (tutorialData?.units && tutorialData.units.length > 0 && !activeUnit) {
      const formattedUnits = tutorialData.units.map((u: any) => ({
        id: u.id,
        unitTitle: u.unitTitle,
        order: u.order,
        content: u.content,
        publish: u.publish
      }));
      setUnits(formattedUnits);
      setActiveUnit(formattedUnits[0]);
    }
  }, [tutorialData]);

  const { mutate: submitCreate, isPending: isCreating } = useMutation({
    mutationFn: (data: any) => createTutorial(data),
    onSuccess: (data) => {
      const created = data.createTutorial;
      router.replace(`/tutorials/tutorialEditor?editOrCreate=edit&tutorialId=${created.id}`);
    },
  });

  const { mutate: submitUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => updateTutorial(data),
    onSuccess: () => {
      console.log("Successfully Updated");
    },
  });

  const handleAddUnit = (newUnit: any) => {
    setUnits((prev) => [...prev, newUnit]);
    setActiveUnit(newUnit);
  };

  const handleEditUnit = (unit: any) => {
    setActiveUnit(unit);
  };

  const handleUpdateUnit = (updatedUnit: any, oldUnit: any) => {
    setUnits((prev) =>
      prev.map((u) => (u.order === oldUnit.order ? updatedUnit : u))
    );
    setActiveUnit(updatedUnit);
  };

  const handleReorderUnits = (reorderedUnits: any[]) => {
    setUnits(reorderedUnits);
    // If active unit was moved, update it to keep sync
    if (activeUnit) {
      const updatedActive = reorderedUnits.find(u => u.id === activeUnit.id || (u.unitTitle === activeUnit.unitTitle && u.content === activeUnit.content));
      if (updatedActive) setActiveUnit(updatedActive);
    }
  };

  const handleEditorChange = () => {
    const mdx: string = editorRef.current?.getMarkdown() || ''
    if (!activeUnit) return;

    setUnits((prev) =>
      prev.map((u) =>
        u.order === activeUnit.order ? { ...u, content: mdx } : u,
      ),
    );
  };

  const handleTutorialDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTutorialDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const tempPreview = URL.createObjectURL(file);
      setLocalPreviewUrl(tempPreview);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", "tutorial-images");
      formData.append("fileName", file.name);

      const response = await fetch(
        'https://root-lms-api.vercel.app/files/uploadFileVercelBlob',
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const uploadedFileUrl = await response.text();
      setTutorialDetails((prev) => ({ ...prev, thumbnail: uploadedFileUrl }));
    } catch (err) {
      console.error("Upload failed:", err);
      setLocalPreviewUrl(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveTutorial = async () => {
    const ubaseTutorialData = {
      authorId: user?.sub,
      category: tutorialDetailes.category,
      description: tutorialDetailes.description,
      level: tutorialDetailes.level,
      thumbnail: tutorialDetailes.thumbnail,
      publish: tutorialDetailes.publish,
      tutorialName: tutorialDetailes.tutorialName,
      units: units.map((u) => ({
        id: u.id,
        unitTitle: u.unitTitle,
        order: u.order,
        content: u.content,
        publish: u.publish,
      })),
    };

    if (tutorialId) {
      submitUpdate({ ...ubaseTutorialData, id: tutorialId });
    } else {
      submitCreate(ubaseTutorialData);
    }
  };

  useEffect(() => {
    if (!editorRef.current || !activeUnit) return;
    editorRef.current.setMarkdown(activeUnit.content);
  }, [activeUnit?.id, activeUnit?.order]);

  return (
    <div className="h-screen flex bg-background gap-5 p-2 ">

      {/* SIDEBAR - Fixed Width and Flex Column */}
      {/* 1. Ensure only this outer container dictates the 450px width */}
      <div className="border-r-2 border-ink bg-surface flex flex-col shrink-0 shadow-wire z-10 h-full" style={{ width: '450px' }}>

        {/* TOP CONTROLS - Fixed height */}
        <div className="p-4 flex flex-col gap-3 border-b-2 border-ink bg-background/40 shrink-0">
          <button
            onClick={handleSaveTutorial}
            disabled={isCreating || isUpdating}
            className="
              w-full h-[48px] bg-ink text-background font-black uppercase tracking-[0.1em] text-[11px]
              hover:bg-teal-primary transition-all active:translate-y-0.5 shadow-wire border-2 border-ink
              disabled:opacity-50 disabled:cursor-wait
            "
          >
            {isCreating || isUpdating ? "[ PROCESSING... ]" : "[ INITIALIZE_SAVE ]"}
          </button>

          <div className="flex h-[42px] bg-background border-2 border-ink w-full overflow-hidden">
            <label
              className={`flex-1 flex items-center justify-center cursor-pointer text-[10px] font-black uppercase transition-colors ${!tutorialDetailes.publish ? "bg-ink text-background" : "text-dust hover:text-ink"}`}
            >
              <input
                type="radio"
                name="tutorial_status"
                className="hidden"
                checked={!tutorialDetailes.publish}
                onChange={() => setTutorialDetails((prev) => ({ ...prev, publish: false }))}
              />
              Draft
            </label>
            <div className="w-px bg-ink h-full"></div>
            <label
              className={`flex-1 flex items-center justify-center cursor-pointer text-[10px] font-black uppercase transition-colors ${tutorialDetailes.publish ? "bg-teal-primary text-background" : "text-teal-primary hover:bg-teal-primary hover:text-background"}`}
            >
              <input
                type="radio"
                name="tutorial_status"
                className="hidden"
                checked={!!tutorialDetailes.publish}
                onChange={() => setTutorialDetails((prev) => ({ ...prev, publish: true }))}
              />
              Live
            </label>
          </div>
        </div>

        {/* INNER COLLAPSIBLE WRAPPER */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* Section 1: Meta Config */}
          {/* FIX: Removed the rogue w-[400px] class from here so it fits the sidebar properly */}
          <div className="flex flex-col border-b-2 border-ink shrink-0 p-2">
            <button
              onClick={() => setIsMetaOpen(!isMetaOpen)}
              className="w-full flex items-center justify-between p-4 bg-background hover:bg-ink hover:text-background transition-colors sticky top-0 z-20"
            >
              <span className="font-mono font-black text-xs tracking-widest uppercase">
                01 // TUTORIAL_META
              </span>
              <ChevronIcon isOpen={isMetaOpen} />
            </button>

            {isMetaOpen && (
              <div className="p-4 flex flex-col gap-6 bg-surface max-h-[350px] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase font-black tracking-widest pl-1 opacity-70 text-ink">
                      Thumbnail_Image
                    </label>
                    <div className="flex gap-3">
                      <div className="w-20 h-20 shrink-0 bg-background border-2 border-ink shadow-wire flex items-center justify-center overflow-hidden relative group">
                        {(localPreviewUrl || tutorialDetailes.thumbnail) ? (
                          <img
                            src={tutorialDetailes.thumbnail}
                            alt="Thumbnail"
                            className={`w-full h-full object-cover ${isUploadingImage ? 'opacity-40 animate-pulse' : 'opacity-80'}`}
                          />
                        ) : (
                          <span className="text-[8px] text-dust font-mono font-black uppercase text-center">NA</span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="text-[9px] font-mono text-dust truncate mb-1">
                          {isUploadingImage ? "UPLOADING..." : (tutorialDetailes.thumbnail ? "FILE_READY" : "NO_FILE")}
                        </div>
                        <label className="cursor-pointer px-3 py-1.5 bg-ink text-background text-[9px] font-black border-2 border-ink uppercase tracking-wider hover:bg-teal-primary transition-colors inline-block text-center">
                          CHOOSE_NEW
                          <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <InputField
                    type="text"
                    name="tutorialName"
                    placeholder="Tutorial_Title"
                    value={tutorialDetailes.tutorialName}
                    onChange={handleTutorialDetailsChange}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      type="text"
                      name="category"
                      placeholder="Category"
                      value={tutorialDetailes.category}
                      onChange={handleTutorialDetailsChange}
                    />
                    <InputField
                      type="text"
                      name="level"
                      placeholder="Level"
                      value={tutorialDetailes.level}
                      onChange={handleTutorialDetailsChange}
                    />
                  </div>

                  <InputField
                    type="textarea"
                    name="description"
                    placeholder="Description"
                    value={tutorialDetailes.description}
                    onChange={handleTutorialDetailsChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Units */}
          <div className={`flex flex-col flex-1 min-h-0 p-2 overflow-hidden ${isUnitsOpen ? 'flex-1' : 'shrink-0'}`}>
            <button
              onClick={() => setIsUnitsOpen(!isUnitsOpen)}
              className="w-full flex items-center justify-between p-4 bg-background hover:bg-ink hover:text-background transition-colors border-b-2 border-ink sticky top-0 z-20"
            >
              <span className="font-mono font-black text-xs tracking-widest uppercase">
                02 // UNIT_SEQUENCE
              </span>
              <ChevronIcon isOpen={isUnitsOpen} />
            </button>

            {isUnitsOpen && (
              <div className="flex-1 min-h-0 overflow-hidden">
                <CreateUnitsContainer
                  units={units}
                  currentUnit={activeUnit}
                  onAddUnit={handleAddUnit}
                  onSelectUnit={handleEditUnit}
                  onUpdateUnit={handleUpdateUnit}
                  onReorderUnits={handleReorderUnits}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {/* FIX: Removed overlapping overflow-scroll classes. Set up strict h-screen -> padding -> editor box -> scrollable content */}
      <div className="flex-1 h-screen flex flex-col min-w-0 bg-background">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 bg-surface border-2 border-ink shadow-wire flex flex-col min-h-0">

            <div className="p-3 border-b-2 border-ink bg-background/20 flex justify-between items-center shrink-0">
              <h3 className="font-mono font-black text-teal-primary text-sm tracking-widest uppercase">
                CONTENT_EDITOR
              </h3>
              <span className="text-[9px] font-mono font-bold text-dust uppercase">
                {activeUnit ? `EDITING_UNIT: ${activeUnit.order} - ${activeUnit.unitTitle}` : "IDLE"}
              </span>
            </div>

            {/* Only the space exactly where the editor sits is allowed to scroll vertically */}
            <div className="flex-1 overflow-y-auto custom-scrollbar ">
              <ForwardRefEditor
                ref={editorRef}
                markdown={activeUnit?.content || ""}
                onChange={handleEditorChange}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
