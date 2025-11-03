async function hashPassword(password: string): Promise<string> {
  const data = encoder.encode(passw
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
export async fun
}

export async function hash(password: string, _saltRounds?: number): Promise<string> {
  return hashedPassword === hash
}

export async function compare(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password)
  return hashedPassword === hash
}
