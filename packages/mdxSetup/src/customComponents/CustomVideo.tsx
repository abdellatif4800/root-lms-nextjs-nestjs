"use client";
import {
  useMdastNodeUpdater,
  useLexicalNodeRemove,
  usePublisher,
  insertJsx$,
  Button,
  JsxEditorProps,
} from "@mdxeditor/editor";
import { useEffect, useState, useRef } from "react";
import { SimpleSeparator } from "./HorizontalSeprator";
import MuxPlayer from '@mux/mux-player-react'

const NEST_API = "http://localhost:8002";

type VideoStatus = "idle" | "uploading" | "processing" | "ready" | "error";

interface MuxUploadResponse {
  uploadId: string;
  uploadUrl: string;
}

// Mux upload object shape (from /files/mux/upload/:uploadId)
interface MuxUploadData {
  id: string;
  status: string;
  asset_id?: string; // present once Mux has created the asset
}

// Mux asset object shape (from /files/mux/asset/:assetId)
interface MuxAssetData {
  id: string;
  status: string; // 'preparing' | 'ready' | 'errored'
  playback_ids?: { id: string; policy: string }[];
}

// ─── Video Display Component ──────────────────────────────────────────────────
export function VideoComponent({
  playbackId,
  title,
  caption,
}: {
  playbackId: string;
  title?: string;
  caption?: string;
}) {
  if (!playbackId) return null;

  return (
    <>
      <SimpleSeparator />
      <div className="flex flex-col gap-2 items-center p-8">
        <div
          className="w-full max-w-2xl rounded-md overflow-hidden"
          style={{ border: "1px solid var(--teal-glow, #2dd4bf)" }}
        >
          <MuxPlayer
            streamType="on-demand"
            playbackId={playbackId}
            metadataVideoTitle={title || ""}
            style={{ width: "100%", aspectRatio: "16/9" }}
          />
        </div>
        {caption && (
          <span className="italic text-sm mt-1" style={{ color: "gray" }}>
            {caption}
          </span>
        )}
      </div>
      <SimpleSeparator />
    </>
  );
}

// ─── Upload Progress Bar ──────────────────────────────────────────────────────
function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full flex flex-col gap-1">
      <div
        className="flex justify-between text-xs"
        style={{ color: "#94a3b8" }}
      >
        <span>Uploading to Mux…</span>
        <span>{progress}%</span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 4, background: "#1e2a38" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #38bdf8, #2dd4bf)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: VideoStatus }) {
  const map: Record<VideoStatus, { label: string; color: string; bg: string }> =
  {
    idle: { label: "No video", color: "#475569", bg: "#0f172a" },
    uploading: { label: "Uploading…", color: "#38bdf8", bg: "#0f2030" },
    processing: { label: "Processing…", color: "#f59e0b", bg: "#1c1200" },
    ready: { label: "Ready ✓", color: "#34d399", bg: "#021a0e" },
    error: { label: "Error", color: "#f87171", bg: "#1a0202" },
  };
  const { label, color, bg } = map[status];
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ color, background: bg, border: `1px solid ${color}22` }}
    >
      {label}
    </span>
  );
}

// ─── Video Component Editor ───────────────────────────────────────────────────
export const VideoComponentEditor = ({ mdastNode }: JsxEditorProps) => {
  const updateMdastNode = useMdastNodeUpdater();
  const removeNode = useLexicalNodeRemove();

  const getAttr = (name: string) => {
    const attr = mdastNode.attributes.find(
      (a) => a.type === "mdxJsxAttribute" && a.name === name
    );
    return attr?.value?.toString() || "";
  };

  const [playbackId, setPlaybackId] = useState(getAttr("playbackId") || "");
  const [title, setTitle] = useState(getAttr("title") || "");
  const [caption, setCaption] = useState(getAttr("caption") || "");
  const [status, setStatus] = useState<VideoStatus>(
    playbackId ? "ready" : "idle"
  );
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Sync mdast whenever attrs change ───
  useEffect(() => {
    const otherAttributes = mdastNode.attributes.filter(
      (a) =>
        a.type === "mdxJsxAttribute" &&
        !["playbackId", "title", "caption"].includes(a.name as string)
    );

    const newAttributes: any[] = [
      ...otherAttributes,
      { type: "mdxJsxAttribute", name: "playbackId", value: playbackId },
      { type: "mdxJsxAttribute", name: "title", value: title },
    ];

    if (caption) {
      newAttributes.push({
        type: "mdxJsxAttribute",
        name: "caption",
        value: caption,
      });
    }

    updateMdastNode({ ...mdastNode, attributes: newAttributes } as any);
  }, [playbackId, title, caption]);

  // ─── Cleanup poll on unmount ───
  useEffect(
    () => () => {
      if (pollRef.current) clearInterval(pollRef.current);
    },
    []
  );

  // ─── Step 3: poll asset until status === 'ready' ───
  // Only call this with a real Asset ID (not an Upload ID)
  const pollAsset = (assetId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${NEST_API}/files/mux/asset/${assetId}`);
        const asset: MuxAssetData = await res.json();

        if (asset.status === "ready") {
          clearInterval(pollRef.current!);
          const pid = asset.playback_ids?.[0]?.id || "";
          setPlaybackId(pid);
          setStatus("ready");
        } else if (asset.status === "errored") {
          clearInterval(pollRef.current!);
          setStatus("error");
          setError("Mux processing failed.");
        }
        // else still 'preparing' — keep polling
      } catch {
        clearInterval(pollRef.current!);
        setStatus("error");
        setError("Failed to check asset status.");
      }
    }, 4000);
  };

  // ─── Step 2: poll upload until asset_id appears, then hand off to pollAsset ───
  // Uses /files/mux/upload/:uploadId — NOT /files/mux/asset/:uploadId
  const pollUploadForAssetId = (uploadId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${NEST_API}/files/mux/upload/${uploadId}`);
        const upload: MuxUploadData = await res.json();

        if (upload.asset_id) {
          // ✅ asset_id is now available — stop polling upload, start polling asset
          clearInterval(pollRef.current!);
          pollAsset(upload.asset_id);
        }
        // else Mux hasn't created the asset yet — keep polling
      } catch {
        clearInterval(pollRef.current!);
        setStatus("error");
        setError("Failed to check upload status.");
      }
    }, 3000);
  };

  // ─── Handle file upload ───
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setStatus("uploading");
    setProgress(0);

    try {
      // 1. Get a direct upload URL from NestJS
      const urlRes = await fetch(`${NEST_API}/files/mux/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorialId: "", unitId: "" }),
      });

      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, uploadId }: MuxUploadResponse = await urlRes.json();

      // 2. Upload directly to Mux via XHR (for progress tracking)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };
        xhr.onload = () => (xhr.status < 400 ? resolve() : reject(new Error(`XHR ${xhr.status}`)));
        xhr.onerror = () => reject(new Error("Upload XHR failed"));
        xhr.send(file);
      });

      // 3. File is uploaded — Mux will now create an asset asynchronously
      setStatus("processing");
      setProgress(100);

      // Poll the upload object until Mux attaches an asset_id to it,
      // then poll the asset until status === 'ready'
      pollUploadForAssetId(uploadId);

    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Upload failed.");
    }
  };

  // ─── Manual playbackId input ───
  const handleManualId = (val: string) => {
    setPlaybackId(val);
    setStatus(val ? "ready" : "idle");
    setError("");
  };

  return (
    <div
      className="border p-3 rounded-md flex flex-col gap-3 shadow-lg"
      style={{ background: "#0d1117", borderColor: "#1e2a38" }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color: "#38bdf8", fontSize: 16 }}>▶</span>
          <span
            className="text-xs font-semibold tracking-wide"
            style={{ color: "#94a3b8" }}
          >
            Mux Video
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Preview */}
      <div
        className="w-full flex items-center justify-center rounded-md overflow-hidden"
        style={{
          minHeight: 160,
          background: "#060a0f",
          border: "1px dashed #1e2a38",
          aspectRatio: "16/9",
        }}
      >
        {status === "ready" && playbackId ? (
          <VideoComponent
            playbackId={playbackId}
            title={title}
            caption={caption}
          />
        ) : status === "processing" ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "#38bdf8", borderTopColor: "transparent" }}
            />
            <span className="text-xs" style={{ color: "#f59e0b" }}>
              Mux is transcoding your video…
            </span>
          </div>
        ) : status === "error" ? (
          <span className="text-xs" style={{ color: "#f87171" }}>
            {error || "Something went wrong."}
          </span>
        ) : (
          <span className="text-xs" style={{ color: "#334155" }}>
            No video selected
          </span>
        )}
      </div>

      {/* Progress bar */}
      {status === "uploading" && <UploadProgress progress={progress} />}

      {/* Controls */}
      <div className="flex flex-col gap-2">
        {/* File upload */}
        <label
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs cursor-pointer transition-all w-full"
          style={{
            background: "#0f2030",
            border: "1px solid #38bdf8",
            color:
              status === "uploading" || status === "processing"
                ? "#334155"
                : "#38bdf8",
            cursor:
              status === "uploading" || status === "processing"
                ? "not-allowed"
                : "pointer",
          }}
        >
          <span>⬆</span>
          <span>Upload Video</span>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={status === "uploading" || status === "processing"}
          />
        </label>

        {/* Manual playback ID */}
        <input
          className="w-full bg-transparent border px-2 py-1 text-xs text-white outline-none rounded"
          style={{ borderColor: "#1e2a38" }}
          placeholder="Or paste Mux Playback ID…"
          value={playbackId}
          onChange={(e) => handleManualId(e.target.value)}
        />

        {/* Title */}
        <input
          className="bg-transparent border px-2 py-1 text-sm text-white outline-none rounded"
          style={{ borderColor: "#1e2a38" }}
          placeholder="Video title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Caption */}
        <input
          className="bg-transparent border px-2 py-1 text-sm text-white outline-none rounded"
          style={{ borderColor: "#1e2a38" }}
          placeholder="Caption…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Remove */}
        <button
          onClick={removeNode}
          className="text-red-500 hover:text-white border px-2 py-1 rounded text-xs uppercase font-bold w-fit"
          style={{ background: "#0d1117", borderColor: "#2d2020" }}
        >
          ✕ Remove Video
        </button>
      </div>
    </div>
  );
};

// ─── Toolbar Insert Button ────────────────────────────────────────────────────
export const InsertVideoComponent = () => {
  const insertJsx = usePublisher(insertJsx$);

  return (
    <Button
      onClick={() =>
        insertJsx({
          name: "VideoComponent",
          kind: "flow",
          props: { playbackId: "", title: "", caption: "" },
        })
      }
      title="Insert Video"
    >
      <div className="font-bold text-lg leading-none mb-1">Video</div>
    </Button>
  );
};
