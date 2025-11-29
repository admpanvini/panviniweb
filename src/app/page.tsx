import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken"
import { redirect } from "next/navigation"

export default async function UserPage() {
  //EN EL SERVIDOR ANTES DE IMPRIMIR
  //Valido el token de la cookie
  const datos_cuenta=await getDataFromCookiesToken() 
  //Si no existe lo mando a loguearse 
  if(!datos_cuenta){redirect("/auth")}               
  //Si es admin va a Admin, si no es del tipo admin lo redirecciono a user
  datos_cuenta.cuenta_tipo=="admin"?redirect("/admin"):redirect("/user") 
  return(
    <div>Init</div>
  )
}