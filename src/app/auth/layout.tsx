import Landing_login from "@/components/blocks/sections/Landing/Landing";
import "../globals.css";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { redirect } from "next/navigation";


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  //EN EL SERVIDOR ANTES DE IMPRIMIR
  //Valido el token de la cookie
  const datos_cuenta=await getDataFromCookiesToken() 
  //Si hay sesión lo mando a cual corresponde
  if(datos_cuenta){
    //Si es admin va a Admin, si no es del tipo admin lo redirecciono a user
    datos_cuenta.cuenta_tipo=="admin"?redirect("/admin"):redirect("/user") 
  }               
  //Si está todo OK imprimo el landing
  return (
      <Landing_login>{children}</Landing_login>
  );
}
