"use client";
import { createContext, useContext, useState, useEffect } from "react";

type AdminData = {
  cuenta_titular?: string;
  cuenta_tipo?: string;
  cuenta_id?: number;
  cuenta_email?: string;
  cuenta_telefono?: string;
};

const AdminContext = createContext<{
  adminData: AdminData | null;
  setAdminData: React.Dispatch<React.SetStateAction<AdminData | null>>;
} | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  
  useEffect(() => {
    async function getAdminData() {
      try {
        const res = await fetch("/api/admin/getdata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        console.log("Admin data ->", data);
        setAdminData({ cuenta_titular: data.cuenta_titular, cuenta_tipo: data.cuenta_tipo, cuenta_id: data.cuenta_id ,cuenta_email: data.cuenta_email, cuenta_telefono: data.cuenta_telefono});
      } catch (error) {
        console.error("Error fetching admin data", error);
      }
    }
    getAdminData();
  }, []);

  return (
    <AdminContext.Provider value={{ adminData, setAdminData }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
