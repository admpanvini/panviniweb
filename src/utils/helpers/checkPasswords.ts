import bcrypt from 'bcryptjs'


export async function checkPasswords(clave: string, hash: string): Promise<boolean> {
  // Normalizar prefijo de PHP ($2y$ → $2a$)
  const hashNormalizado = hash.replace(/^\$2y\$/, '$2a$')
  return await bcrypt.compare(clave, hashNormalizado)
}