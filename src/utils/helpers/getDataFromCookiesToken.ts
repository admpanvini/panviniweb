import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export default async function getDataFromCookiesToken() {
    try {
        const cookieStore = await cookies()                // obtengo todas las cookies
        const token = cookieStore.get("token")?.value || ''      // leo la cookie "token"        
        if (!token) throw new Error(); // si el token es inválido/expirado
        const data= jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;  // verifico la firma/expiración del token
        return data;
    } catch {
        return null; // si el token es inválido/expirado
    }
}