import CryptoJS from 'crypto-js'

/**
 * Encrypts a token using AES encryption
 * @param token The token to encrypt
 * @param salt The salt used for key derivation
 * @returns The encrypted token as a string
 */
export const encryptToken = (token: string, salt: string): string => {
  const key = CryptoJS.PBKDF2(salt, salt, {keySize: 256 / 32, iterations: 1000})
  return CryptoJS.AES.encrypt(token, key.toString()).toString()
}

/**
 * Decrypts an encrypted token
 * @param encryptedToken The encrypted token to decrypt
 * @param salt The salt used for key derivation
 * @returns The decrypted token as a string
 */
export const decryptToken = (encryptedToken: string, salt: string): string => {
  const key = CryptoJS.PBKDF2(salt, salt, {keySize: 256 / 32, iterations: 1000})
  const decrypted = CryptoJS.AES.decrypt(encryptedToken, key.toString())
  return decrypted.toString(CryptoJS.enc.Utf8)
}
