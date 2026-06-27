"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loading } from "../../template/Loading";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [clave, setClave] = useState(""); 
    const [error, setError] = useState<string[]| undefined>(undefined)  
    const [unidad_codigo, setUnidad_codigo] = useState("");   
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();
        let loginOk = false;
        setError(undefined)
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ unidad_codigo, email, clave }),
            });
            const data = await res.json();
            if(!res.ok){
                setError([data.error || "No se pudo iniciar sesiÃ³n"]) //Si hay error lo mustra
            }else{
                loginOk = true;
                if (data.cuenta_tipo == 'admin') {
                    router.push("/admin")
                } else {
                    router.push("/user")
                }
            }
        } catch (err) {
            console.error("Fallo login:", err);
            setError(["Error de conexiÃ³n"])
        } finally {
            if (!loginOk) {
                setLoading(false);
            }
        }
    };
    return(
        <div>
            <form onSubmit={handleSubmit} className="space-y-3 text-[var(--baseSuperClara)] border-[var(--baseClara)]  focus:ring-[var(--baseClara)] ">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2  outline-none placeholder:text-[var(--baseClara)]"
                />
                <input
                    type="text"
                    placeholder="Unidad"
                    value={unidad_codigo}
                    onChange={(e) => setUnidad_codigo(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--baseClara)] text-white py-2 rounded-lg font-semibold cursor-pointer hover:bg-[var(--baseOscura)] transition disabled:opacity-80"
                >
                {loading ? <Loading type="inline" text="Iniciando sesión..." color="#f8fffc"/> : "Iniciar Sesión"}
                </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-100">
                <div>
                    {error?.map((e, i) => (
                    <p key={i} className="text-[#e86b6b]">{e}</p>
                    ))}
                    {
                        error?<br/>:''
                    }
                </div>
            <p>
                ¿No tenés cuenta?{" "}
                <a href="/auth/signup" className="text-[var(--baseClara)] hover:underline">
                Registrate
                </a>
                
            </p>
            <p>
                <a href="/auth/recover" className="text-[var(--baseClara)] hover:underline">
                ¿Olvidaste tu clave?
                </a>
            </p>
            </div>
        </div>
    )
}
