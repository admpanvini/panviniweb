"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [clave, setClave] = useState(""); 
    const [error, setError] = useState<string[]| undefined>(undefined)  
    const [unidad_codigo, setUnidad_codigo] = useState("");   
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();
        setError(undefined)
        setLoading(true);
        try {
            const res = await fetch("api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ unidad_codigo, email, clave }),
            });
            const data = await res.json();
            if(!res.ok){
                setError([data.error]) //Si hay error lo mustra
            }else{
                data.cuenta_tipo=='admin'? router.push("/admin"): router.push("/user") //Sino redirige a user | admin
            }
        } catch (err) {
            console.error("Fallo login:", err);
        } finally {
            setLoading(false);
        }
    };
    return(
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[#6e718a]  focus:ring-2 focus:ring-[#9099f5] outline-none text-[#000]"
                />
                <input
                    type="text"
                    placeholder="Unidad"
                    value={unidad_codigo}
                    onChange={(e) => setUnidad_codigo(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[#6e718a]  focus:ring-2 focus:ring-[#9099f5] outline-none text-[#000]"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[#6e718a] focus:ring-2 focus:ring-[#9099f5] outline-none text-[#000]"
                />

                <button
                    type="submit"
                    className="w-full bg-[#9099f5] text-white py-2 rounded-lg font-semibold hover:bg-[#1c2370] transition"
                >
                {loading ? "Cargando..." : "Acceder"}
                </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
                <div>
                    {error?.map((e, i) => (
                    <p key={i} className="text-[#c21515]">{e}</p>
                    ))}
                    {
                        error?<br/>:''
                    }
                </div>
            <p>
                ¿No tenés cuenta?{" "}
                <a href="/auth/signup" className="text-[#9099f5] hover:underline">
                Registrate
                </a>
                
            </p>
            <p>
                <a href="/auth/recover" className="text-[#9099f5] hover:underline">
                ¿Olvidaste tu clave?
                </a>
            </p>
            </div>
        </div>
    )
}