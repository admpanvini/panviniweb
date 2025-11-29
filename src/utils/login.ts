import { supabase } from './db_connector/supabase'

type Request_Input={
  email: string,
  unidad_codigo: string
}

export async function getCuentaByEmail({email="",unidad_codigo=""}:Request_Input){
  console.log(email,unidad_codigo)
  const { data, error } = await supabase.rpc('get_cuenta_by_email', {
    p_email: email,
    p_unidad_codigo: unidad_codigo
  })

  if (error) {
    console.error('Error al consultar cuenta:', error.message)
    throw new Error('No se pudo obtener la cuenta')
  }

  return data
}