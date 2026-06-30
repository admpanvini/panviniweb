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
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-field"
                />
                <input
                    type="text"
                    placeholder="Unidad"
                    value={unidad_codigo}
                    onChange={(e) => setUnidad_codigo(e.target.value)}
                    className="auth-field"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    className="auth-field"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="auth-button cursor-pointer"
                >
                {loading ? <Loading type="inline" text="Iniciando sesión..." color="#f8fffc"/> : "Iniciar Sesión"}
                </button>
            </form>
            <div className="auth-helper">
                <div>
                    {error?.map((e, i) => (
                    <p key={i} className="auth-error">{e}</p>
                    ))}
                    {
                        error?<br/>:''
                    }
                </div>
            <p>
                ¿No tenés cuenta?{" "}
                <a href="/auth/signup" className="auth-link">
                Registrate
                </a>
                
            </p>
            <p>
                <a href="/auth/recover" className="auth-link">
                ¿Olvidaste tu clave?
                </a>
            </p>
            </div>
        </div>
    )
}
