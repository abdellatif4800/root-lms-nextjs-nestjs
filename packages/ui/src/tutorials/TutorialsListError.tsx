export default function TutorialsListError({ error }: { error: any }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="wire-card max-w-lg w-full p-8 flex flex-col gap-6 border-teal-primary/30 shadow-wire-teal">
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 border-2 border-ink bg-teal-primary/10 flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase text-ink">Action_Failed</h2>
            <p className="font-mono text-[10px] text-dust uppercase">Ref_Code: ERR_FETCH_09</p>
          </div>
        </div>

        <div className="p-4 border-2 border-ink border-dashed font-mono text-xs text-ink/80">
           {">"} ERROR: {error.message || "Failed to retrieve modules from the server."}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => window.location.reload()} className="btn-wire-teal py-3 text-xs">
            Retry_Request
          </button>
          <button onClick={() => window.history.back()} className="btn-wire py-3 text-xs">
            Return_to_Base
          </button>
        </div>
      </div>
    </div>
  );
}
