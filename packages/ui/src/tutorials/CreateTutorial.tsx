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

export function CreateTutorialPage({ tutorialId }: { tutorialId?: string }) {
  const [activeStep, setActiveStep] = useState(1);
  const editorRef = useRef<MDXEditorMethods>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.authSlice);

  const router = useRouter()

  const { data: tutorialData, isLoading } = useQuery({
    queryKey: ["tutorialById", tutorialId],
    queryFn: () => getTutorialById(tutorialId!),
    enabled: !!tutorialId,
  });

  const [tutorialDetailes, setTutorialDetails] = useState({
    tutorialName: tutorialData?.tutorialName,
    author: user?.sub,
    category: tutorialData?.category,
    description: tutorialData?.description,
    level: tutorialData?.level,
    thumbnail: tutorialData?.thumbnail,
    publish: tutorialData?.publish,
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
  } | null>(tutorialData?.units[0]);

  // 1. Create Mutation
  const { mutate: submitCreate, isPending: isCreating } = useMutation({
    mutationFn: (data: any) => createTutorial(data),
    onSuccess: (data) => {
      const created = data.createTutorial;
      setTutorialDetails({
        tutorialName: created.tutorialName,
        author: user?.sub,
        category: created.category,
        description: created.description,
        level: created.level,
        thumbnail: created.thumbnail,
        publish: created.publish,
      });

      const formattedUnits = created.units.map((u: any) => ({
        id: u.id,
        unitTitle: u.unitTitle,
        order: u.order,
        content: u.content,
        publish: u.publish
      }));

      setUnits(formattedUnits);

      if (formattedUnits.length > 0) {
        setActiveUnit(formattedUnits[0]);
      }

      router.replace(`/tutorials/tutorialEditor?editOrCreate=edit&tutorialId=${created.id}`);
    },
    onError: (err) => {
      console.error("Error creating:", err);
    },
  });

  // 2. Update Mutation
  const { mutate: submitUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => updateTutorial(data),
    onSuccess: (data) => {
      console.log("Successfully Updated:", data);
    },
    onError: (err) => {
      console.error("Error updating:", err);
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
      formData.append("bucketName", "tutorial-images");
      formData.append("fileName", file.name);

      const response = await fetch(
        `https://root-lms-api.vercel.app/files/uploadFile`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

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

  const getButtonStyle = (isActive: boolean) => {
    const base =
      "flex-1 w-full justify-center h-[42px] px-6 text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 active:translate-y-0.5 ";
    const activeStyle =
      "bg-teal-primary text-background border-2 border-ink shadow-wire hover:bg-background hover:text-ink ";
    const inactiveStyle =
      "bg-surface text-dust border-2 border-ink hover:border-teal-primary hover:text-teal-primary ";
    return base + (isActive ? activeStyle : inactiveStyle);
  };

  useEffect(() => {
    if (!editorRef.current || !activeUnit) return;
    editorRef.current.setMarkdown(activeUnit.content);
  }, [activeUnit])

  return (
    <div className="h-full flex flex-col gap-6 p-6 bg-background">
      <div className="w-full bg-surface border-2 border-ink p-4 shrink-0 shadow-wire">
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => setActiveStep(1)}
            className={getButtonStyle(activeStep === 1)}
          >
            <span
              className={`flex items-center justify-center w-4 h-4 rounded-sm text-[9px] border-2 ${activeStep === 1 ? "border-background" : "border-current"}`}
            >
              1
            </span>
            <span>Meta_Config</span>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={getButtonStyle(activeStep === 2)}
          >
            <span
              className={`flex items-center justify-center w-4 h-4 rounded-sm text-[9px] border-2 ${activeStep === 2 ? "border-background" : "border-current"}`}
            >
              2
            </span>
            <span>Unit_Sequence</span>
          </button>

          <div className="flex h-[42px] bg-background border-2 border-ink w-48 overflow-hidden">
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

          <button
            onClick={handleSaveTutorial}
            disabled={isCreating || isUpdating}
            className="
              flex-1 w-full justify-center
              h-[42px] bg-ink text-background font-black uppercase tracking-[0.1em] text-[10px] px-8
              hover:bg-teal-primary transition-all active:translate-y-0.5 shadow-wire border-2 border-ink
              disabled:opacity-50 disabled:cursor-wait
            "
          >
            {isCreating || isUpdating ? "[ PROCESSING... ]" : "[ INITIALIZE_SAVE ]"}
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-visible min-h-0">
        {activeStep === 1 && (
          <div className="h-full w-full max-w-4xl mx-auto flex flex-col justify-center">
            <div className="bg-surface border-2 border-ink p-10 shadow-wire relative flex flex-col gap-2">
              <div className=" bg-ink text-[9px] text-background px-3 py-1 font-mono font-black tracking-widest uppercase">
                STEP 1 // INITIALIZATION
              </div>

              <div className="flex flex-col gap-6 items-start">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[10px] uppercase font-black tracking-widest pl-1 opacity-70 text-ink">
                    Thumbnail_Image
                  </label>
                  <div className="relative border-2 border-ink bg-background p-2 flex items-center gap-4 transition-colors hover:border-teal-primary group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={isUploadingImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                    />
                    <div className="px-4 py-1.5 bg-ink text-background text-[10px] font-black border-2 border-ink uppercase tracking-wider pointer-events-none group-hover:bg-teal-primary transition-colors">
                      Choose_File
                    </div>
                    <span className="text-xs text-ink font-mono font-bold truncate pointer-events-none opacity-60">
                      {isUploadingImage
                        ? "UPLOADING_DATA..."
                        : tutorialDetailes.thumbnail || "NO_FILE_SELECTED"}
                    </span>
                  </div>
                </div>

                <div className="w-32 h-32 shrink-0 bg-background border-2 border-ink shadow-wire flex items-center justify-center overflow-hidden relative group">
                  {(localPreviewUrl || tutorialDetailes.thumbnail) ? (
                    <img
                      src={tutorialDetailes.thumbnail}
                      alt="Thumbnail Preview"
                      className={`w-full h-full object-cover transition-opacity ${isUploadingImage ? 'opacity-40 animate-pulse' : 'opacity-80 group-hover:opacity-100'}`}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-[8px] text-dust font-mono font-black uppercase text-center px-2 leading-tight tracking-widest">
                      Awaiting<br />Signal
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mt-8">
                <InputField
                  type="text"
                  name="tutorialName"
                  placeholder="Tutorial_Title"
                  value={tutorialDetailes.tutorialName}
                  onChange={handleTutorialDetailsChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Difficulty_Level"
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
          </div>
        )}

        {activeStep === 2 && (
          <div className="flex h-full gap-8">
            <div className="w-1/4 min-w-[300px] flex flex-col bg-surface border-2 border-ink shadow-wire relative overflow-hidden">
              <div className="p-3 border-b-2 border-ink bg-background/20">
                <h3 className="font-mono font-black text-ink text-sm tracking-widest uppercase">
                  UNIT_SEQUENCE
                </h3>
              </div>

              <CreateUnitsContainer
                units={units}
                currentUnit={activeUnit}
                onAddUnit={handleAddUnit}
                onSelectUnit={handleEditUnit}
                onUpdateUnit={handleUpdateUnit}
              />
            </div>

            <div className="flex-1 flex flex-col gap-6 h-full overflow-visible relative z-30">
              <div className="flex-1 bg-surface border-2 border-ink shadow-wire relative overflow-visible flex flex-col">
                <div className="p-3 border-b-2 border-ink bg-background/20 flex justify-between items-center">
                  <h3 className="font-mono font-black text-teal-primary text-sm tracking-widest uppercase">
                    CONTENT_EDITOR
                  </h3>
                  <span className="text-[9px] font-mono font-bold text-dust uppercase">
                    {activeUnit ? `EDITING_UNIT: ${activeUnit.order}` : "IDLE"}
                  </span>
                </div>

                <div className="flex-1">
                  <ForwardRefEditor
                    ref={editorRef}
                    markdown={activeUnit?.content || ""}
                    onChange={handleEditorChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
