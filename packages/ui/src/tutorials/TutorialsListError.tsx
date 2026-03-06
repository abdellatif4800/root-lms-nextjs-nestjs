export default function TutorialsListError({ error }: { error: any }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto bg-surface-950">
      {/* Scanline bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)" }}
      />

      <div
        className="relative max-w-lg w-full border border-red-500/40 bg-surface-900"
        style={{
          boxShadow: "4px 4px 0px var(--surface-800), 0 0 30px rgba(239,68,68,0.06)",
          clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))"
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)] animate-pulse" />
            <span className="text-[8px] font-terminal uppercase tracking-[0.3em] text-red-500/70">
              SYSTEM://ERROR &nbsp;|&nbsp; FATAL
            </span>
          </div>
          <span className="text-[8px] font-terminal text-text-secondary opacity-40">
            {new Date().toISOString()}
          </span>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">

          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 bg-red-500/10 border border-red-500/50 flex items-center justify-center shrink-0"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="rgb(239,68,68)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-digital font-black uppercase tracking-wider text-red-400 leading-none mb-1">
                System_Error
              </h2>
              <p className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.2em] opacity-60">
                // DATA_FETCH_FAILED &nbsp;·&nbsp; MODULE_UNAVAILABLE
              </p>
            </div>
          </div>

          {/* Terminal log */}
          <div className="border border-surface-800 bg-surface-950 p-4 overflow-auto max-h-36 custom-scrollbar">
            <div className="flex flex-col gap-1.5">
              <LogLine color="red" label="ERR">
                {error.message || "Unable to load tutorial modules"}
              </LogLine>
              <LogLine color="dim" label="STATUS">CONNECTION_FAILED</LogLine>
              <LogLine color="dim" label="CODE">{error.code || "ECONNREFUSED"}</LogLine>
              <LogLine color="dim" label="TRACE">
                {error.stack?.split("\n")[1]?.trim() || "tutorials/list → getTutorials()"}
              </LogLine>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="
                flex-1 relative overflow-hidden group/retry
                border border-emerald-glow/50 bg-transparent
                text-emerald-glow text-[9px] font-digital font-black uppercase tracking-wider
                py-2.5 transition-colors duration-200 hover:text-black
              "
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
            >
              <span className="absolute inset-0 bg-emerald-glow translate-x-[-100%] group-hover/retry:translate-x-0 transition-transform duration-200 z-0" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="opacity-60 group-hover/retry:opacity-100">↺</span>
                Retry_Connection
              </span>
            </button>

            <button
              onClick={() => window.history.back()}
              className="
                flex-1 relative overflow-hidden group/back
                border border-surface-700 bg-transparent
                text-text-secondary text-[9px] font-digital font-black uppercase tracking-wider
                py-2.5 transition-colors duration-200 hover:text-black
              "
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
            >
              <span className="absolute inset-0 bg-text-secondary translate-x-[-100%] group-hover/back:translate-x-0 transition-transform duration-200 z-0" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="opacity-60 group-hover/back:opacity-100">←</span>
                Return_to_Hub
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function LogLine({ color, label, children }: { color: "red" | "dim"; label: string; children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-terminal leading-relaxed break-all flex gap-2">
      <span className={`shrink-0 ${color === "red" ? "text-red-500" : "text-text-secondary opacity-40"}`}>{">"}</span>
      <span className={`shrink-0 font-black uppercase w-14 ${color === "red" ? "text-red-400" : "text-text-secondary opacity-50"}`}>
        [{label}]
      </span>
      <span className={color === "red" ? "text-red-300" : "text-text-secondary opacity-60"}>{children}</span>
    </p>
  );
}
