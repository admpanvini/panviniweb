export function Loading({
  type = "inline",
  text = "Cargando...",
  height = "200px",
  fontSize="",
  appType = "admin",
  color = ""
}: {
  type?: "full" | "inline" | "replace";
  text?: string;
  height?: string;
  fontSize?:string;
  appType?:("user"|"admin");
  color?:string
}) {
    if(!color){
        appType == "admin" ? color=`var(--baseOscura-admin)` : color=`var(--baseOscura)`;
    }
    // FULL SCREEN overlay
    if (type === "full") {
    return (
        <div className={`fixed inset-0 z-50 bg-[${color}]/30 backdrop-blur-sm flex items-center justify-center`}>
        <div className="px-4 py-2">
            <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 border-4 border-[${color}] border-t-transparent rounded-full animate-spin`} />
            <span className={`text-[${color}]`}>{text}</span>
            </div>
        </div>
        </div>
    );
    }

    // REPLACE → ocupa un espacio definido
    if (type === "replace") {
    return (
        <div
        className="flex items-center justify-center w-full"
        style={{ height,fontSize }}
        >
        <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 border-4 border-[${color}] border-t-transparent rounded-full animate-spin`}/>
            <span className={`text-[${color}]`}>{text}</span>
        </div>
        </div>
    );
    }

    // INLINE → small loader que NO rompe layout
    if (type === "inline") {
        return (
            <span className={`flex justify-center items-center gap-2 text-sm opacity-90 text-[${color}]`}>
                <span className={`w-4 h-4 border-2 border-[${color}] border-t-transparent rounded-full animate-spin`}></span>
                {text} 
            </span>
        );
    }
}
