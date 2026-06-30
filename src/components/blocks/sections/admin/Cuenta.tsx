"use client";
import {
  Card,
  Text,
  Metric,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
} from "@tremor/react";
import { Book, BookOpen, Building, Database, Edit, FileText, HomeIcon, Key, LocateIcon, LocationEditIcon, Mail, MailIcon, MapPin, Phone, PhoneIcon, Settings, User, User2, UserLock } from "lucide-react";
import { useEffect, useState } from "react";
import { Loading } from "../../template/Loading";
import { useAdmin } from "./AdminContext";



export default function CuentaAdmin() {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos de cuenta..");
  const [loadingButton,setLoadingButon]= useState(false);
  const [loadingButton2,setLoadingButon2]= useState(false);
  const [submitUserText,setSubmitUserText]= useState('')
  const [submitPasswordText,setPasswordUserText]= useState('')
  const userCtx = useAdmin();
  const userData = userCtx?.adminData;
  const [dataForm, setDataForm] = useState({
    nombre: userData?.cuenta_titular || '',
    telefono:  userData?.cuenta_telefono || '',
    email: userData?.cuenta_email || '',
    tipoCuenta:  userData?.cuenta_tipo || '',
  });
  const [dataFormClave, setDataFormClave] = useState({
    clave_actual: "",
    clave_nueva_1: "",
    clave_nueva_2: ""
  });
  const [cuentas,setCuentas]= useState<any[]>([]);
  useEffect(() => {
    if (userData) {
      setDataForm({
        nombre: userData.cuenta_titular || '',
        telefono:  userData.cuenta_telefono || '',
        email: userData.cuenta_email || '',
        tipoCuenta:  userData.cuenta_tipo || '',
      });
    }
  }, [userData]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDataFormClave({
      ...dataFormClave,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingButon(true);

      const res = await fetch("/api/user/edituserdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: dataForm.nombre,
          telefono: dataForm.telefono,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSubmitUserText(data.error)
        return;
      }
      setSubmitUserText('Sus datos se han guardado correctamente.')
      setTimeout(function(){setSubmitUserText('')},4000)
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingButon(false);
    }
  };
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingButon2(true);
      const res = await fetch("/api/user/edituserpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataFormClave),
      });
      if (!res.ok) {
        const data = await res.json();
        setPasswordUserText(data.error || "Error");
        return;
      }
      setPasswordUserText('Sus password se ha guardado correctamente.')
      setTimeout(function(){setPasswordUserText('')},4000)
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
    }finally {
      setLoadingButon2(false);
    }
  };

  useEffect(() => {
    async function getFiles() {
      try {
        setLoadingText("Cargando cuentas asociadas..")
        const res = await fetch("/api/user/getunitaccounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        })
        console.log(res)
        const data = await res.json()
        console.log("Cuentas",data,userData)
        setCuentas(data || [])
        setLoading(false)

      } catch (error) {
        console.error("Error fetching files", error)
      }
    }

    getFiles()
  }, [])

  
  return (
    <div>
    {loading || !userData? 
    (
      <Loading type="replace" height="150px" text={loadingText} appType="admin" />
    )
    :(
    <div className="space-y-5">
        <h1 className="app-title mb-4">
        <Settings className="w-6 h-6" />
        Tu cuenta
        </h1>
        <h2 className="section-title">
        <Key className="w-6 h-6" /> Otras cuentas administradoras
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {cuentas?.map((v, i) => (
            <div
              key={i}
              className="contact-card"
            >
              <div className="info-icon mb-0"><Key className="w-5 h-5" /></div>
              <div>
                <div className="font-semibold text-[var(--baseOscura-admin)]">{v.cuenta_titular}</div>
                <div className="text-sm text-[var(--surfaceMuted)]">{v.cuenta_email}</div>
                <div className="text-xs text-[var(--surfaceMuted)]">{v.cuenta_telefono} - {v.cuenta_tipo}</div>
              </div>
            </div>
          ))}
        </div>
        <h2 className="section-title">
        <UserLock className="w-6 h-6" /> Datos de la cuenta
        </h2>
        <form onSubmit={handleSubmitUser} className="form-shell max-w-3xl space-y-4 text-[var(--baseOscura-admin)]">
          Nombre:
          <input
            name="nombre"
            placeholder="Nombre"
            value={dataForm.nombre}
            onChange={handleChange}
            className="app-input"
          />
          Telefono:
          <input
            name="telefono"
            placeholder="Teléfono"
            value={dataForm.telefono}
            onChange={handleChange}
            className="app-input"
          />
          Email:
          <input
            disabled
            name="email"
            type="email"
            placeholder="Email"
            value={dataForm.email}
            onChange={handleChange}
            className="app-input bg-[var(--baseSuperClara-admin)]"
          />
          Tipo de cuenta:
          <select disabled
            name="tipoCuenta"
            value={dataForm.tipoCuenta}
            onChange={handleChange}
            className="app-input bg-[var(--baseSuperClara-admin)]"
          >
            <option value="">Tipo de cuenta</option>
            <option value="admin">Admin</option>
            <option value="inquilino">Inquilino</option>
            <option value="inmobiliaria">Inmobiliaria</option>
            <option value="propietario">Propietario</option>
          </select>
          <p className="text-sm font-semibold">{submitUserText}</p>
          <Button
          type="submit"
          disabled={loadingButton}
          className="app-button w-full cursor-pointer"
          >
            {!loadingButton?("Modificar datos personales"):(<Loading type="inline" text={"Actualizando datos"} color="#FFF"></Loading>)}
          </Button>
        </form>
        <h2 className="section-title">
        <UserLock className="w-6 h-6" /> Edita tu clave
        </h2>
        <form onSubmit={handleSubmitPassword} className="form-shell max-w-3xl space-y-4 text-[var(--baseOscura-admin)]">
          <input
            name="clave_actual"
            placeholder="Clave actual"
            type="password"
            value={dataFormClave.clave_actual}
            onChange={handleChangePassword}
            className="app-input"
          />

          <input
            name="clave_nueva_1"
            placeholder="Clave nueva"
            type="password"
            value={dataFormClave.clave_nueva_1}
            onChange={handleChangePassword}
            className="app-input"
          />

          <input
            name="clave_nueva_2"
            placeholder="Repetir clave nueva"
            type="password"
            value={dataFormClave.clave_nueva_2}
            onChange={handleChangePassword}
            className="app-input"
          />
          <p className="text-sm font-semibold">{submitPasswordText}</p>
          <Button
          type="submit"
          disabled={loadingButton2}
          className="app-button w-full cursor-pointer"
          >
            {!loadingButton2?("Modificar tu clave"):(<Loading type="inline" text={"Intentando cambiar tu clave.."} color="#FFF"></Loading>)}
          </Button>
        </form>
    </div>
    )}
    </div>
  );
}
