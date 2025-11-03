const encoder = new TextEncoder()

async function hashPassword(password: string): Promise<string> {
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export async function hash(password: string, _saltRounds?: number): Promise<string> {
  return hashPassword(password)
}

export async function compare(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password)
  return hashedPassword === hash
}