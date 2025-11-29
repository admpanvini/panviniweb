import UserLayout from "@/components/blocks/sections/User/Layout";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { redirect } from "next/navigation"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  //EN EL SERVIDOR ANTES DE IMPRIMIR
  //Valido el token de la cookie
  const datos_cuenta=await getDataFromCookiesToken() 
  //Si no existe lo mando a loguearse 
  if(!datos_cuenta){redirect("/auth")}               
  //Si es del tipo admin lo redirecciono
  if(datos_cuenta?.cuenta_tipo=="admin"){redirect("/admin")} 
  //Si está todo OK imprimo el landing
  console.log("Datos de la cuenta: ",datos_cuenta)
  return (
      <UserLayout>{children}</UserLayout>
  );
}
