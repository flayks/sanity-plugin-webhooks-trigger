import CryptoJS from 'crypto-js'

/** Derives an AES key from a salt using PBKDF2 */
const deriveKey = (salt: string) =>
  CryptoJS.PBKDF2(salt, salt, {keySize: 256 / 32, iterations: 1000}).toString()

/**
 * Encrypts a token using AES encryption
 * @param token - The token to encrypt
 * @param salt - The salt used for key derivation
 */
export const encryptToken = (token: string, salt: string): string =>
  CryptoJS.AES.encrypt(token, deriveKey(salt)).toString()

/**
 * Decrypts an encrypted token
 * @param encryptedToken - The encrypted token to decrypt
 * @param salt - The salt used for key derivation
 */
export const decryptToken = (encryptedToken: string, salt: string): string => {
  const token = CryptoJS.AES.decrypt(encryptedToken, deriveKey(salt)).toString(CryptoJS.enc.Utf8)
  // Empty means a wrong salt. Without this the request would silently go out unauthenticated
  if (!token) throw new Error('Could not decrypt the auth token. Check your encryptionSalt.')
  return token
}
