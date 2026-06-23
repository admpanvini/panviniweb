// context/UserContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";

type UserData = {
  unidad_codigo?: string;
  unidad_nombre?: string;
  unidad_saldo_1?: number;
  unidad_vto_saldo_1?:Date;
  unidad_saldo_2?: number;
  unidad_vto_saldo_2?:Date;
  unidad_titular?: string;
  propiedad_nombre?:string;
  propiedad_direccion?:string;
  propiedad_datos?:string;
  cuenta_titular?:string;
  cuenta_tipo?:string;
  cuenta_email?:string;
  cuenta_telefono?:string;
};

const UserContext = createContext<{
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await fetch("/api/user/getdata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        console.log(",,,,,",data)
        setUserData({
          unidad_codigo: data.unidad_codigo,
          unidad_nombre: data.unidad_nombre,
          unidad_saldo_1: data.unidad_saldo1,
          unidad_saldo_2: data.unidad_saldo2,
          unidad_vto_saldo_1: data.unidad_vto_saldo1,
          unidad_vto_saldo_2: data.unidad_vto_saldo2,
          unidad_titular: data.unidad_titular,
          propiedad_nombre: data.propiedad_nombre,
          propiedad_datos: data.propiedad_datos,
          propiedad_direccion: data.propiedad_direccion,
          cuenta_titular: data.cuenta_titular,
          cuenta_tipo: data.cuenta_tipo,
          cuenta_email: data.cuenta_email,
          cuenta_telefono: data.cuenta_telefono
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }
    getUserData();
  }, []);

  return (
    <UserContext.Provider value={{userData,setUserData}}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
