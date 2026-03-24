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

const NEST_API = "https://root-lms-api.vercel.app";
//const NEST_API = "http://localhost:8002";

type VideoStatus = "idle" | "uploading" | "processing" | "ready" | "error";

interface MuxUploadResponse {
  uploadId: string;
  uploadUrl: string;
}

interface MuxUploadData {
  id: string;
  status: string;
  asset_id?: string;
}

interface MuxAssetData {
  id: string;
  status: string;
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
      <div className="flex flex-col gap-4 items-center my-12 px-4">
        <div className="w-full max-w-3xl border-2 border-ink shadow-wire bg-ink">
          <MuxPlayer
            streamType="on-demand"
            playbackId={playbackId}
            metadataVideoTitle={title || ""}
            style={{ width: "100%", aspectRatio: "16/9", display: "block" }}
          />
        </div>
        {caption && (
          <span className="text-xs font-mono font-bold text-dust uppercase tracking-widest text-center max-w-lg">
            // {caption}
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
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-dust">
        <span>Sending file to server…</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-3 border-2 border-ink bg-background p-[1px]">
        <div
          className="h-full bg-teal-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: VideoStatus }) {
  const labels: Record<VideoStatus, string> = {
    idle: "Ready to Upload",
    uploading: "Sending...",
    processing: "Finalizing...",
    ready: "Live",
    error: "Failed",
  };
  return (
    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border-2 ${status === 'ready' ? 'border-teal-primary text-teal-primary bg-teal-primary/5' :
      status === 'error' ? 'border-red-500 text-red-500 bg-red-500/5' :
        'border-ink text-ink bg-surface'
      }`}>
      {labels[status]}
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
  const [status, setStatus] = useState<VideoStatus>(playbackId ? "ready" : "idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const otherAttributes = mdastNode.attributes.filter(
      (a) => a.type === "mdxJsxAttribute" && !["playbackId", "title", "caption"].includes(a.name as string)
    );
    const newAttributes: any[] = [
      ...otherAttributes,
      { type: "mdxJsxAttribute", name: "playbackId", value: playbackId },
      { type: "mdxJsxAttribute", name: "title", value: title },
    ];
    if (caption) newAttributes.push({ type: "mdxJsxAttribute", name: "caption", value: caption });
    updateMdastNode({ ...mdastNode, attributes: newAttributes } as any);
  }, [playbackId, title, caption]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const pollAsset = (assetId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${NEST_API}/files/mux/asset/${assetId}`);
        const asset: MuxAssetData = await res.json();
        if (asset.status === "ready") {
          clearInterval(pollRef.current!);
          setPlaybackId(asset.playback_ids?.[0]?.id || "");
          setStatus("ready");
        } else if (asset.status === "errored") {
          clearInterval(pollRef.current!);
          setStatus("error");
          setError("Processing failed.");
        }
      } catch {
        clearInterval(pollRef.current!);
        setStatus("error");
        setError("Network error during verification.");
      }
    }, 4000);
  };

  const pollUploadForAssetId = (uploadId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${NEST_API}/files/mux/upload/${uploadId}`);
        const upload: MuxUploadData = await res.json();

        if (upload.asset_id) {
          clearInterval(pollRef.current!);
          pollAsset(upload.asset_id);
        }
      } catch {
        clearInterval(pollRef.current!);
        setStatus("error");
        setError("Network error during upload.");
      }
    }, 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setStatus("uploading");
    setProgress(0);
    try {
      const urlRes = await fetch(`${NEST_API}/files/mux/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorialId: "", unitId: "" }),
      });
      if (!urlRes.ok) throw new Error("Could not get upload link.");
      const { uploadUrl, uploadId }: MuxUploadResponse = await urlRes.json();
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => (xhr.status < 400 ? resolve() : reject(new Error(`Server error ${xhr.status}`)));
        xhr.onerror = () => reject(new Error("Network connection lost."));
        xhr.send(file);
      });
      setStatus("processing");
      setProgress(100);
      pollUploadForAssetId(uploadId);
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Something went wrong.");
    }
  };

  return (
    <div className="border-2 border-ink p-6 bg-surface shadow-wire flex flex-col gap-6 my-4 font-sans text-ink">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-ink bg-teal-primary/10 flex items-center justify-center text-sm">▶</div>
          <span className="text-[10px] font-black uppercase tracking-widest">Lesson Video</span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="w-full flex items-center justify-center border-2 border-dashed border-ink/20 bg-background aspect-video relative overflow-hidden">
        {status === "ready" && playbackId ? (
          <div className="absolute inset-0 pointer-events-none opacity-50 grayscale contrast-125">
            <VideoComponent playbackId={playbackId} title={title} />
          </div>
        ) : status === "processing" ? (
          <div className="flex flex-col items-center gap-3 text-center p-4">
            <div className="w-8 h-8 border-2 border-ink border-t-teal-primary rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Finalizing Video...</span>
          </div>
        ) : status === "error" ? (
          <div className="text-center p-4">
            <span className="text-[10px] font-black uppercase text-red-500">{error || "Upload Error"}</span>
          </div>
        ) : (
          <span className="text-[10px] font-black uppercase text-dust/40">No video selected</span>
        )}
      </div>

      {status === "uploading" && <UploadProgress progress={progress} />}

      <div className="space-y-4">
        <label className="btn-wire-teal w-full py-2.5 text-[10px] uppercase font-black tracking-widest text-center cursor-pointer block">
          Choose Video File
          <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} disabled={status === "uploading" || status === "processing"} />
        </label>

        <div className="space-y-3">
          <input className="w-full bg-background border-2 border-ink p-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-primary/20 placeholder:text-dust/30" placeholder="Paste Video ID..." value={playbackId} onChange={(e) => setPlaybackId(e.target.value)} />
          <input className="w-full bg-background border-2 border-ink p-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-primary/20 placeholder:text-dust/30" placeholder="Internal Title..." value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="w-full bg-background border-2 border-ink p-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-primary/20 placeholder:text-dust/30" placeholder="Public Caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>

        <button onClick={removeNode} className="text-red-500 hover:underline text-[10px] font-black uppercase pt-2">Remove Component</button>
      </div>
    </div>
  );
};

export const InsertVideoComponent = () => {
  const insertJsx = usePublisher(insertJsx$);
  return (
    <Button onClick={() => insertJsx({ name: "VideoComponent", kind: "flow", props: { playbackId: "", title: "", caption: "" } })} title="Insert Lesson Video">
      <div className="font-black text-lg leading-none mb-1">Video</div>
    </Button>
  );
};
