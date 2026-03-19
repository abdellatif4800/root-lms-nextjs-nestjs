"use client";

import { InputField } from "@repo/ui";
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
  // We use this to show the image instantly before it finishes uploading to the server
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
    author: user.sub,
    category: tutorialData?.category,
    description: tutorialData?.description,
    level: tutorialData?.level,
    thumbnail: tutorialData?.thumbnail,
    publish: tutorialData?.publish,
  });


  const [units, setUnits] = useState<
    { id: string, unitTitle: string; order: number; content: string; publish: boolean }[]
  >(tutorialData?.units.map((u: any) => ({
    id: u.id, // <--- include id
    unitTitle: u.unitTitle,
    order: u.order,
    content: u.content,
    publish: u.publish
  }))
    || []);

  const [activeUnit, setActiveUnit] = useState<{
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
      console.log(created)
      // 1. Update Tutorial Meta
      setTutorialDetails({
        tutorialName: created.tutorialName,
        author: user.sub,
        category: created.category,
        description: created.description,
        level: created.level,
        thumbnail: created.thumbnail,
        publish: created.publish,
      });

      // 2. Update Units (Crucial: now includes server-generated IDs)
      const formattedUnits = created.units.map((u: any) => ({
        id: u.id,
        unitTitle: u.unitTitle,
        order: u.order,
        content: u.content,
        publish: u.publish
      }));

      setUnits(formattedUnits);

      // 3. Set the first unit as active if it exists
      if (formattedUnits.length > 0) {
        setActiveUnit(formattedUnits[0]);
      }

      // 4. Redirect to edit mode
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
      // Optional: Show success toast
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
    console.log(activeUnit)
  };

  const handleUpdateUnit = (updatedUnit: any, oldUnit: any) => {
    // 1. Update the main units array
    setUnits((prev) =>
      prev.map((u) => (u.order === oldUnit.order ? updatedUnit : u))
    );
    // 2. Update the currently active unit so the inputs reflect what you just typed
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
    console.log(units);

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

      // Instant local preview
      const tempPreview = URL.createObjectURL(file);
      setLocalPreviewUrl(tempPreview);

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucketName", "tutorial-images"); // Or whatever bucket you use for thumbnails
      formData.append("fileName", file.name);

      // Upload to your REST endpoint
      const response = await fetch(
        `http://localhost:8000/adminApi/files/uploadFile`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Your endpoint returns the text URL/name
      const uploadedFileUrl = await response.text();

      // Update the main state with the uploaded string
      setTutorialDetails((prev) => ({ ...prev, thumbnail: uploadedFileUrl }));

    } catch (err) {
      console.error("Upload failed:", err);
      // Revert the preview if it fails
      setLocalPreviewUrl(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveTutorial = async () => {
    // Shared payload data
    const ubaseTutorialData = {
      authorId: user.sub,
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
      "flex-1 w-full justify-center h-[42px] px-6 text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 active:translate-y-[1px] active:shadow-none ";
    const activeStyle =
      "bg-teal-glow text-black border border-teal-glow shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:bg-white ";
    const inactiveStyle =
      "bg-transparent text-text-secondary border border-surface-700 hover:border-teal-glow hover:text-teal-glow hover:shadow-[2px_2px_0px_rgba(45,212,191,0.3)] ";
    return base + (isActive ? activeStyle : inactiveStyle);
  };

  useEffect(() => {
    if (!editorRef.current || !activeUnit) return;
    editorRef.current.setMarkdown(activeUnit.content);
  }, [activeUnit])

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-visible">
      <div className="w-full bg-surface-900 border border-surface-800 p-4 shrink-0 shadow-[4px_4px_0px_var(--surface-800)]">
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => setActiveStep(1)}
            className={getButtonStyle(activeStep === 1)}
          >
            <span
              className={`flex items-center justify-center w-4 h-4 rounded-sm text-[9px] border ${activeStep === 1 ? "border-black" : "border-current"}`}
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
              className={`flex items-center justify-center w-4 h-4 rounded-sm text-[9px] border ${activeStep === 2 ? "border-black" : "border-current"}`}
            >
              2
            </span>
            <span>Unit_Sequence</span>
          </button>

          <div className="flex h-[42px] bg-surface-900 border border-surface-700 w-48">
            <label
              className={`flex-1 flex items-center justify-center cursor-pointer text-[10px] font-bold uppercase transition-colors ${!tutorialDetailes.publish ? "bg-surface-700 text-white" : "text-surface-500 hover:text-surface-300"}`}
            >
              <input
                type="radio"
                name="tutorial_status"
                className="hidden"
                checked={!tutorialDetailes.publish}
                // Add this onChange to set publish to false (Draft)
                onChange={() => setTutorialDetails((prev) => ({ ...prev, publish: false }))}
              />
              Draft
            </label>

            <div className="w-px bg-surface-700 h-full"></div>

            <label
              className={`flex-1 flex items-center justify-center cursor-pointer text-[10px] font-bold uppercase transition-colors ${tutorialDetailes.publish ? "bg-teal-glow text-black" : "text-teal-glow hover:text-white"}`}
            >
              <input
                type="radio"
                name="tutorial_status"
                className="hidden"
                // Using !! ensures it evaluates as a strict boolean, preventing other warnings
                checked={!!tutorialDetailes.publish}
                // Add this onChange to set publish to true (Live)
                onChange={() => setTutorialDetails((prev) => ({ ...prev, publish: true }))}
              />
              Live
            </label>
          </div>

          <button
            onClick={handleSaveTutorial}
            disabled={isCreating || isUpdating} // Prevent double clicks!
            className="
    flex-1 w-full justify-center
    h-[42px] bg-purple-glow text-black font-black uppercase tracking-[0.1em] text-[10px] px-8
    hover:bg-white transition-all active:translate-y-[1px] active:translate-x-[1px] active:shadow-none
    shadow-[4px_4px_0px_rgba(0,0,0,0.5)] disabled:opacity-50 disabled:cursor-wait border border-purple-glow
  "
          >
            {isCreating || isUpdating ? "[ PROCESSING... ]" : "[ INITIALIZE_SAVE ]"}
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-visible min-h-0">
        {activeStep === 1 && (
          <div className="h-full w-full max-w-4xl mx-auto flex flex-col justify-center">
            <div className="bg-surface-900 border border-surface-800 p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] relative">
              <div className="absolute top-0 left-0 bg-surface-800 text-[9px] text-text-secondary px-3 py-1 font-mono tracking-widest">
                STEP_01 // INITIALIZATION
              </div>
              {/* --- THUMBNAIL IMAGE UPLOADER --- */}
              <div className="flex flex-col gap-4 items-start">
                <div className="flex flex-col gap-2 w-full">
                  <div className="relative border border-surface-700 bg-surface-900 p-2 flex items-center gap-4 transition-colors hover:border-teal-glow">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={isUploadingImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                    />
                    <div className="px-3 py-1 bg-surface-800 text-[10px] font-bold text-teal-glow border border-surface-700 uppercase tracking-wider pointer-events-none">
                      Choose_File
                    </div>
                    <span className="text-xs text-surface-400 font-mono truncate pointer-events-none">
                      {isUploadingImage
                        ? "UPLOADING_DATA..."
                        : tutorialDetailes.thumbnail || "NO_FILE_SELECTED"}
                    </span>
                  </div>
                </div>

                {/* The Preview Box */}
                <div className="w-24 h-24 shrink-0 bg-surface-950 border border-surface-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden relative group">
                  {(localPreviewUrl || tutorialDetailes.thumbnail) ? (
                    <>
                      < img
                        src={tutorialDetailes.thumbnail}
                        alt="Thumbnail Preview"
                        className={`w-full h-full object-cover transition-opacity ${isUploadingImage ? 'opacity-40 animate-pulse' : 'opacity-80 group-hover:opacity-100'}`}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                      />
                    </>
                  ) : (
                    <span className="text-[8px] text-surface-600 font-mono uppercase text-center px-2 leading-tight tracking-widest">
                      Awaiting<br />Signal
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6">
                <InputField
                  type="text"
                  name="tutorialName"
                  placeholder="Tutorial_Title"
                  value={tutorialDetailes.tutorialName}
                  onChange={handleTutorialDetailsChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={tutorialDetailes.category}
                    onChange={handleTutorialDetailsChange}
                  />
                  {/* <InputField */}
                  {/*   type="text" */}
                  {/*   name="author" */}
                  {/*   placeholder="Author_ID" */}
                  {/*   value={tutorialDetailes.author} */}
                  {/*   onChange={handleTutorialDetailsChange} */}
                  {/* /> */}
                  <InputField
                    type="text"
                    name="level"
                    placeholder="Diff_Level"
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
          <div className="flex h-full gap-6">
            <div className="w-1/4 min-w-[250px] flex flex-col bg-surface-900 border border-surface-800 shadow-[4px_4px_0px_var(--surface-800)] relative overflow-hidden">
              <div className="p-3 border-b border-surface-800 bg-surface-950/30">
                <h3 className="font-digital text-purple-glow text-sm tracking-wider">
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

            <div className="flex-1 flex flex-col gap-4 h-full overflow-visible">
              <div className="flex-1 bg-surface-900 border border-surface-800 shadow-[4px_4px_0px_var(--surface-800)] relative overflow-visible flex flex-col">
                <div className="p-3 border-b border-surface-800 bg-surface-950/30 flex justify-between items-center">
                  <h3 className="font-digital text-teal-glow text-sm tracking-wider">
                    CONTENT_EDITOR
                  </h3>
                  <span className="text-[9px] font-mono text-text-secondary">
                    {activeUnit ? `EDITING_ID: ${activeUnit.order}` : "IDLE"}
                  </span>
                </div>

                <div className="flex-1 ">
                  <ForwardRefEditor
                    ref={editorRef}
                    markdown={activeUnit?.content || ""}
                    onChange={
                      handleEditorChange
                    }
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
