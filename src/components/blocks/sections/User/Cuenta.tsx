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
import { Book, BookOpen, Building, Database, Edit, FileText, HomeIcon, Key, LocateIcon, LocationEditIcon, Mail, MailIcon, MapPin, Phone, PhoneIcon, User, User2, UserLock } from "lucide-react";
import DynamicTable from "@/components/base/DynamicTable";
import formatFechaArgentina from "@/components/helpers/dataFormat";
import { useUser } from "./UserContext";
import { useEffect, useState } from "react";
import { Loading } from "../../template/Loading";



export default function Cuenta() {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos de cuenta..");
  const [loadingButton,setLoadingButon]= useState(false);
  const [loadingButton2,setLoadingButon2]= useState(false);
  const [submitUserText,setSubmitUserText]= useState('')
  const [submitPasswordText,setPasswordUserText]= useState('')
  const userCtx = useUser();
  const userData = userCtx?.userData;
  const [dataForm, setDataForm] = useState({
    nombre: userData?.cuenta_titular || '',
    telefono: userData?.cuenta_telefono || '',
    email: userData?.cuenta_email || '',
    tipoCuenta: userData?.cuenta_tipo || '',
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
        telefono: userData.cuenta_telefono || '',
        email: userData.cuenta_email || '',
        tipoCuenta: userData.cuenta_tipo || '',
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
        console.log("Cuentas",data)
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
      <Loading type="replace" height="150px" text={loadingText} appType="user" />
    )
    :(
    <div>
        <h1 className="flex items-center gap-2 text-[2em] text-[var(--baseOscura)] mb-4">
        <User className="w-6 h-6" />
        Tu cuenta
        </h1>
        <h2 className="flex items-center my-[20px] gap-2 text-[1.5em] text-[var(--baseOscura)] mb-[10px] border-t-[1px] border-[var(--baseClara)] pt-[10px]">
        <BookOpen className="w-6 h-6" /> Datos de la unidad
        </h2>
        <h2 className="sm:flex items-center gap-2 text-[.9em] my-[20px] ml-[5px] text-[var(--baseOscura)] mb-[10px]">
          <div className="flex my-[8px]">
            <Building className="w-6 h-6 mr-1" />
            {userData?.propiedad_nombre}
          </div>
          <div className="flex my-[8px]">
            <MapPin className="w-6 h-6 mr-1" />
            {userData?.propiedad_direccion}
          </div>
          <div className="flex my-[8px]">
            <HomeIcon className="w-6 h-6 mr-1" />
            {userData?.unidad_nombre}
          </div>
          <div className="flex my-[8px]">
            <Key className="w-6 h-6 mr-1" />
             {userData?.unidad_titular}(titular de la unidad)
          </div>
        
        
        </h2>
        <h2 className="flex items-center my-[20px] gap-2 text-[1.5em] text-[var(--baseOscura)] mb-[10px] border-t-[1px] border-[var(--baseClara)] pt-[10px]">
        <User className="w-6 h-6" /> Cuentas asociadas al la unidad
        </h2>
        <div className="items-center gap-2 text-[.9em] my-[20px] ml-[10px] text-[var(--baseOscura)] mb-[10px]">
          {cuentas?.map((v, i) => (
            <div
              key={i}
              className="flex my-[8px] border-b-[1px] border-[var(--baseSuperClara)]"
            >
              <User className="w-6 h-6 mr-1" />
              {v.cuenta_titular} - {v.cuenta_email} - {v.cuenta_telefono} - {v.cuenta_tipo}
            </div>
          ))}
        </div>
        <h2 className="flex items-center my-[20px] gap-2 text-[1.5em] text-[var(--baseOscura)] mb-[10px] border-t-[1px] border-[var(--baseClara)] pt-[10px]">
        <UserLock className="w-6 h-6" /> Datos de la cuenta
        </h2>
        <form   onSubmit={handleSubmitUser} className="space-y-3 text-[var(--baseOscura)] [&_input]:border-[var(--baseOscura)] [&_select]:border-[var(--baseOscura)] w-[90vw] max-w-[560px]">
          Nombre:
          <input
            name="nombre"
            placeholder="Nombre"
            value={dataForm.nombre}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          Telefono:
          <input
            name="telefono"
            placeholder="Teléfono"
            value={dataForm.telefono}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          Email:
          <input
            disabled
            name="email"
            type="email"
            placeholder="Email"
            value={dataForm.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-[var(--baseSuperClara)]"
          />
          Tipo de cuenta:
          <select disabled
            name="tipoCuenta"
            value={dataForm.tipoCuenta}
            onChange={handleChange}
            className="w-full border rounded px-3 py-3 bg-[var(--baseSuperClara)]"
          >
            <option value="">Tipo de cuenta</option>
            <option value="inquilino">Inquilino</option>
            <option value="inmobiliaria">Inmobiliaria</option>
            <option value="propietario">Propietario</option>
          </select>
          <p>{submitUserText}</p>
          <Button
          type="submit"
          disabled={loadingButton}
          className={`w-full bg-[var(--baseOscura)] text-[1.1em] px-3 py-2 text-white rounded cursor-pointer`}
          >
            {!loadingButton?("Modificar datos personales"):(<Loading type="inline" text={"Actualizando datos"} color="#FFF"></Loading>)}
          </Button>
        </form>
        <h2 className="flex items-center my-[20px] gap-2 text-[1.5em] text-[var(--baseOscura)] mb-[10px] border-t-[1px] border-[var(--baseClara)] pt-[10px]">
        <UserLock className="w-6 h-6" /> Edita tu clave
        </h2>
        <form onSubmit={handleSubmitPassword} className="space-y-3 text-[var(--baseOscura)] [&_input]:border-[var(--baseOscura)] [&_select]:border-[var(--baseOscura)] w-[90vw] max-w-[560px]">
          <input
            name="clave_actual"
            placeholder="Clave actual"
            type="password"
            value={dataFormClave.clave_actual}
            onChange={handleChangePassword}
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="clave_nueva_1"
            placeholder="Clave nueva"
            type="password"
            value={dataFormClave.clave_nueva_1}
            onChange={handleChangePassword}
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="clave_nueva_2"
            placeholder="Repetir clave nueva"
            type="password"
            value={dataFormClave.clave_nueva_2}
            onChange={handleChangePassword}
            className="w-full border rounded px-3 py-2"
          />
          <p>{submitPasswordText}</p>
          <Button
          type="submit"
          disabled={loadingButton2}
          className={`w-full bg-[var(--baseOscura)] text-[1.1em] px-3 py-2 text-white rounded cursor-pointer`}
          >
            {!loadingButton2?("Modificar tu clave"):(<Loading type="inline" text={"Intentando cambiar tu clave.."} color="#FFF"></Loading>)}
          </Button>
        </form>
    </div>
    )}
    </div>
  );
}
