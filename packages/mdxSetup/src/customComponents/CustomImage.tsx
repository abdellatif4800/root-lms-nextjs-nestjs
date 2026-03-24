"use client"
import { useMdastNodeUpdater, useLexicalNodeRemove, usePublisher, insertJsx$, Button, JsxEditorProps } from "@mdxeditor/editor";
import { useEffect, useState } from "react";
import { SimpleSeparator } from "./HorizontalSeprator";

const BLOB_LIST_URL = "https://root-lms-api.vercel.app/files/listFilesVercelblob?folder=tutorial-images";

interface BlobFile {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

// ─── Image Browse Modal ───────────────────────────────────────────────────────
function ImageBrowseModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string, name: string) => void;
  onClose: () => void;
}) {
  const [blobs, setBlobs] = useState<BlobFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(BLOB_LIST_URL)
      .then((r) => r.json())
      .then((data) => {
        const files = (data.blobs as BlobFile[]).filter(
          (b) => b.size > 0 && !b.pathname.endsWith("/")
        );
        setBlobs(files);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load images.");
        setLoading(false);
      });
  }, []);

  const handleConfirm = () => {
    const blob = blobs.find((b) => b.url === selected);
    if (!blob) return;
    const name = blob.pathname.split("/").pop()?.replace(/\.[^.]+$/, "") || "";
    onSelect(blob.url, name);
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-[9999] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-2"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative flex flex-col bg-surface border-2 border-ink shadow-wire w-full h-full"
      >


        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b-2 border-ink">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-teal-primary" />
            <span className="font-black text-ink text-xs uppercase tracking-tighter">
              Image Library
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-background transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-8 h-8 border-2 border-ink border-t-teal-primary rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase text-dust">Scanning storage...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-40 text-red-500 text-[10px] font-black uppercase">
              {error}
            </div>
          )}

          {!loading && !error && blobs.length === 0 && (
            <div className="flex items-center justify-center h-40 text-dust text-[10px] font-black uppercase">
              No images found in this sector.
            </div>
          )}

          {!loading && !error && blobs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {blobs.map((blob) => {
                const isSelected = selected === blob.url;
                const filename = blob.pathname.split("/").pop() || blob.pathname;
                const kb = (blob.size / 1024).toFixed(1);

                return (
                  <button
                    key={blob.url}
                    onClick={() => setSelected(blob.url)}
                    className={`flex flex-col border-2 transition-all p-1.5 gap-1.5 text-left relative ${isSelected ? "border-teal-primary bg-background shadow-wire-teal" : "border-ink/10 bg-background/50 hover:border-ink"
                      }`}
                  >
                    <div className="w-full aspect-square border-2 border-ink/5 bg-surface flex items-center justify-center overflow-hidden">
                      <img src={blob.url} alt={filename} className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[9px] font-black uppercase truncate ${isSelected ? 'text-teal-primary' : 'text-ink'}`}>{filename}</p>
                      <p className="text-[7px] font-mono text-dust uppercase">{kb} KB</p>
                    </div>
                    {isSelected && <div className="absolute top-1 right-1 w-3 h-3 bg-teal-primary text-background flex items-center justify-center text-[8px] font-black">✓</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-3 py-2 border-t-2 border-ink bg-background/50">
          <button onClick={onClose} className="btn-wire py-1 px-3 text-[9px]">Cancel</button>
          <button onClick={handleConfirm} disabled={!selected} className="btn-wire-teal py-1 px-3 text-[9px] disabled:opacity-50">Insert</button>
        </div>
      </div>
    </div>
  );
}

// ─── Image Display Component ──────────────────────────────────────────────────
export function ImageComponent({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <div className="p-2 flex flex-col gap-2">
      <SimpleSeparator />
      <div className="flex flex-col gap-2 items-center my-3 px-4">
        <div className="border-2 border-red-500 shadow-wire p-1.5 bg-background ">
          <img
            src={src}
            alt={alt || "Illustration"}
            className="max-w-sm w-full h-30 object-contain"
          />
        </div>
        {caption && (
          <span className="text-xs font-mono font-bold text-dust uppercase tracking-widest text-center max-w-lg">
            // {caption}
          </span>
        )}
      </div>
      <SimpleSeparator />
    </div>
  );
}

// ─── Image Component Editor ───────────────────────────────────────────────────
export const ImageComponentEditor = ({ mdastNode }: JsxEditorProps) => {
  const updateMdastNode = useMdastNodeUpdater();
  const removeNode = useLexicalNodeRemove();

  const getAttr = (name: string) => {
    const attr = mdastNode.attributes.find(
      (a) => a.type === "mdxJsxAttribute" && a.name === name
    );
    return attr?.value?.toString() || "";
  };

  const [src, setSrc] = useState(getAttr("src") || "");
  const [alt, setAlt] = useState(getAttr("alt") || "");
  const [caption, setCaption] = useState(getAttr("caption") || "");
  const [showBrowser, setShowBrowser] = useState(false);

  useEffect(() => {
    const otherAttributes = mdastNode.attributes.filter(
      (a) => a.type === "mdxJsxAttribute" && !["src", "alt", "caption"].includes(a.name)
    );
    const newAttributes = [
      ...otherAttributes,
      { type: "mdxJsxAttribute", name: "src", value: src },
      { type: "mdxJsxAttribute", name: "alt", value: alt },
    ];
    if (caption) newAttributes.push({ type: "mdxJsxAttribute", name: "caption", value: caption });
    updateMdastNode({ ...mdastNode, attributes: newAttributes } as any);
  }, [src, alt, caption]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const tempPreview = URL.createObjectURL(file);
      setSrc(tempPreview);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", "tutorial-images");
      formData.append("fileName", alt || file.name);
      const response = await fetch(`https://root-lms-api.vercel.app/files/uploadFileVercelBlob`, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed");
      const uploadedFile = await response.json();
      setSrc(uploadedFile.url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="relative h-70">
      {showBrowser && <ImageBrowseModal onSelect={(url, name) => { setSrc(url); if (!alt) setAlt(name); }} onClose={() => setShowBrowser(false)} />}

      <div className="bg-surface border-2 border-ink p-6 flex flex-col gap-6 shadow-wire my-4 font-sans text-ink">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-ink bg-teal-primary/10 flex items-center justify-center text-sm">📸</div>
            <span className="text-[10px] font-black uppercase tracking-widest">Visual Asset</span>
          </div>
          <button onClick={removeNode} className="text-red-500 hover:underline text-[10px] font-black uppercase">Remove</button>
        </div>

        <div className="w-full flex items-center justify-center border-2 border-dashed border-ink/20 bg-background min-h-[160px] p-4 relative overflow-hidden">
          {src ? (
            <div className="pointer-events-none opacity-50 grayscale contrast-125">
              <ImageComponent src={src} alt={alt} />
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase text-dust/40 text-center">Drag image file or choose from library</span>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="btn-wire flex-1 py-2 text-[10px] uppercase font-black tracking-widest text-center cursor-pointer">
              Upload New File
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            <button onClick={() => setShowBrowser(true)} className="btn-wire-teal py-2 px-6 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
              <span>☁</span> Library
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-dust pl-1">Description (Alt)</label>
              <input className="w-full bg-background border-2 border-ink p-2 text-sm font-bold placeholder:text-dust/30 focus:outline-none focus:ring-2 focus:ring-teal-primary/20" placeholder="e.g. System Diagram" value={alt} onChange={(e) => setAlt(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-dust pl-1">Caption</label>
              <input className="w-full bg-background border-2 border-ink p-2 text-sm font-bold placeholder:text-dust/30 focus:outline-none focus:ring-2 focus:ring-teal-primary/20" placeholder="Shown below the image..." value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InsertImageComponent = () => {
  const insertJsx = usePublisher(insertJsx$);
  return (
    <Button onClick={() => insertJsx({ name: "ImageComponent", kind: "flow", props: { src: "", alt: "", caption: "" } })} title="Insert Visual Asset">
      <div className="font-black text-lg leading-none mb-1">Image</div>
    </Button>
  );
};
