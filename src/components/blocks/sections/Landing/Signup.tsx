

export default function SignUpForm(){
    return(
        <div>
            <form className="space-y-4">
                <input
                    type="text"
                    placeholder="Usuario"
                    className="w-full px-4 py-2 rounded-lg border border-[#6e718a]  focus:ring-2 focus:ring-[#9099f5] outline-none text-[#000]"
                />
                <input
                    type="text"
                    placeholder="Unidad"
                    className="w-full px-4 py-2 rounded-lg border border-[#6e718a]  focus:ring-2 focus:ring-[#9099f5] outline-none text-[#000]"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full px-4 py-2 rounded-lg border border-[#6e718a] focus:ring-2 focus:ring-[#9099f5] outline-none text-[#000]"
                />

                <button
                    type="submit"
                    className="w-full bg-[#9099f5] text-white py-2 rounded-lg font-semibold hover:bg-[#1c2370] transition"
                >
                    Registrarse
                </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
            <p>
                ¿Ya tenés cuenta?{" "}
                <a href="/auth" className="text-[#9099f5] hover:underline">
                Iniciá sesión
                </a>
            </p>
            </div>
        </div>
    )
}