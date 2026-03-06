import bcrypt from 'bcryptjs'

const BCRYPT_PREFIXES = ['$2a$', '$2b$', '$2y$']
const BCRYPT_ROUNDS = 12

export function isPasswordHash(value: string): boolean {
  return BCRYPT_PREFIXES.some((prefix) => value.startsWith(prefix))
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
