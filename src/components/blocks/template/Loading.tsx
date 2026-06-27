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
    const loadingColor = color || (appType == "admin" ? "var(--baseOscura-admin)" : "var(--baseOscura)");
    // FULL SCREEN overlay
    if (type === "full") {
    return (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
        <div className="px-4 py-2">
            <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: loadingColor, borderTopColor: "transparent" }}
            />
            <span style={{ color: loadingColor }}>{text}</span>
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
            <div
              className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: loadingColor, borderTopColor: "transparent" }}
            />
            <span style={{ color: loadingColor }}>{text}</span>
        </div>
        </div>
    );
    }

    // INLINE → small loader que NO rompe layout
    if (type === "inline") {
        return (
            <span className="flex justify-center items-center gap-2 text-sm opacity-90" style={{ color: loadingColor }}>
                <span
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: loadingColor, borderTopColor: "transparent" }}
                ></span>
                {text} 
            </span>
        );
    }

    return null;
}
