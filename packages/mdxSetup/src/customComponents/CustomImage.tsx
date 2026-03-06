"use client"
import { useMdastNodeUpdater, useLexicalNodeRemove, usePublisher, insertJsx$, Button, JsxEditorProps, Separator } from "@mdxeditor/editor";
import { useEffect, useState, useCallback } from "react";
import { SimpleSeparator } from "./HorizontalSeprator";

const BLOB_LIST_URL = "https://vercel-nest-gql-lms.vercel.app/files/listFilesVercelblob?folder=tutorial-images";

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
        // Filter out folder-only entries (size 0 with trailing slash)
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
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal panel */}
      <div
        className="relative flex flex-col rounded-xl shadow-2xl"
        style={{
          width: "min(680px, 95vw)",
          maxHeight: "85vh",
          background: "#0d1117",
          border: "1px solid #1e2a38",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #1e2a38" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "#38bdf8", fontSize: 18 }}>☁</span>
            <span className="font-semibold text-white text-sm tracking-wide">
              Vercel Blob — tutorial-images
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              <span className="animate-pulse">Loading images…</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-40 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && blobs.length === 0 && (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
              No images found in this folder.
            </div>
          )}

          {!loading && !error && blobs.length > 0 && (
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
            >
              {blobs.map((blob) => {
                const isSelected = selected === blob.url;
                const filename = blob.pathname.split("/").pop() || blob.pathname;
                const kb = (blob.size / 1024).toFixed(1);

                return (
                  <button
                    key={blob.url}
                    onClick={() => setSelected(blob.url)}
                    className="flex flex-col rounded-lg overflow-hidden text-left transition-all"
                    style={{
                      border: isSelected
                        ? "2px solid #38bdf8"
                        : "2px solid #1e2a38",
                      background: isSelected ? "#0f2030" : "#111820",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="w-full flex items-center justify-center"
                      style={{ height: 120, background: "#0a0f15" }}
                    >
                      <img
                        src={blob.url}
                        alt={filename}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    {/* Meta */}
                    <div className="px-2 py-2">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: isSelected ? "#38bdf8" : "#cbd5e1" }}
                        title={filename}
                      >
                        {filename}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                        {kb} KB
                      </p>
                    </div>

                    {/* Selected check */}
                    {isSelected && (
                      <div
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "#38bdf8", color: "#000" }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-5 py-4"
          style={{ borderTop: "1px solid #1e2a38" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-sm transition-colors"
            style={{
              background: "transparent",
              border: "1px solid #2d3748",
              color: "#94a3b8",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="px-4 py-1.5 rounded text-sm font-semibold transition-all"
            style={{
              background: selected ? "#38bdf8" : "#1e2a38",
              color: selected ? "#000" : "#475569",
              cursor: selected ? "pointer" : "not-allowed",
              border: "none",
            }}
          >
            Insert Image
          </button>
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
    <>
      <SimpleSeparator />
      <div className="flex flex-col gap-2 items-center p-8">
        <img
          src={src}
          alt={alt || "MDX Image"}
          className="max-w-full max-h-60 w-auto h-auto border rounded-md"
          style={{ borderColor: "var(--teal-glow)" }}
        />
        <span className="italic text-gray-700" style={{ color: "gray" }}>
          {caption}
        </span>
      </div>
      <SimpleSeparator />
    </>
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
      (a) =>
        a.type === "mdxJsxAttribute" &&
        !["src", "alt", "caption"].includes(a.name)
    );

    const newAttributes = [
      ...otherAttributes,
      { type: "mdxJsxAttribute", name: "src", value: src },
      { type: "mdxJsxAttribute", name: "alt", value: alt },
    ];

    if (caption) {
      newAttributes.push({
        type: "mdxJsxAttribute",
        name: "caption",
        value: caption,
      });
    }

    updateMdastNode({ ...mdastNode, attributes: newAttributes });
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
      formData.append("fileName", alt);

      const response = await fetch(
        `https://vercel-nest-gql-lms.vercel.app/files/uploadFileVercelBlob`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Upload failed");

      const uploadedFile = await response.json();
      setSrc(uploadedFile.url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleBlobSelect = (url: string, name: string) => {
    setSrc(url);
    if (!alt) setAlt(name);
  };

  return (
    <>
      {/* Browse Modal */}
      {showBrowser && (
        <ImageBrowseModal
          onSelect={handleBlobSelect}
          onClose={() => setShowBrowser(false)}
        />
      )}

      <div className="bg-surface-900 border border-surface-800 p-3 rounded-md flex flex-col gap-3 shadow-lg">
        {/* Live Preview */}
        <div className="mb-4 border border-dashed border-surface-500 p-2 rounded-md flex flex-col items-center justify-center min-h-[120px] bg-black/10">
          {src ? (
            <ImageComponent src={src} alt={alt} caption={caption} />
          ) : (
            <span className="text-white text-sm">No Image Selected</span>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          {/* Upload row */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex-1 text-sm text-white file:bg-teal-glow file:text-black file:px-2 file:py-1 file:rounded file:border-none"
              disabled={alt === ""}
            />

            {/* Browse Blob button */}
            <button
              onClick={() => setShowBrowser(true)}
              title="Browse uploaded images"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all whitespace-nowrap"
              style={{
                background: "#0f2030",
                border: "1px solid #38bdf8",
                color: "#38bdf8",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 14 }}>☁</span>
              Browse
            </button>
          </div>

          {/* Alt / Name */}
          <input
            className="bg-transparent border border-surface-700 px-2 py-1 text-sm text-white outline-none focus:border-teal-glow w-full"
            placeholder="Image Name..."
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />

          {/* Caption */}
          <input
            className="bg-transparent border border-surface-700 px-2 py-1 text-sm text-white outline-none focus:border-teal-glow w-full"
            placeholder="Caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Remove */}
          <button
            onClick={removeNode}
            className="text-red-500 hover:text-white bg-surface-900 border border-surface-700 px-2 py-1 rounded text-[10px] uppercase font-bold w-fit"
          >
            ✕ Remove Image
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Toolbar Insert Button ────────────────────────────────────────────────────
export const InsertImageComponent = () => {
  const insertJsx = usePublisher(insertJsx$);

  return (
    <Button
      onClick={() =>
        insertJsx({
          name: "ImageComponent",
          kind: "flow",
          props: { src: "", alt: "", caption: "" },
        })
      }
      title="Insert Image"
    >
      <div className="font-bold text-lg leading-none mb-1">Image</div>
    </Button>
  );
};

