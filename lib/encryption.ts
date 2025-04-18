import crypto from "crypto"

// Generate a random AES key
export const generateAESKey = (): Buffer => {
  return crypto.randomBytes(32) // 256-bit key
}

// AES encryption
export const aesEncrypt = (data: Buffer, key: Buffer): { encrypted: Buffer; iv: Buffer } => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
  return { encrypted, iv }
}

// AES decryption
export const aesDecrypt = (encryptedData: Buffer, key: Buffer, iv: Buffer): Buffer => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)
  return Buffer.concat([decipher.update(encryptedData), decipher.final()])
}

// Generate RSA key pair
export const generateRSAKeyPair = (): { publicKey: string; privateKey: string } => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  })
  return { publicKey, privateKey }
}

// RSA encrypt
export const rsaEncrypt = (data: Buffer, publicKey: string): Buffer => {
  return crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    data,
  )
}

// RSA decrypt
export const rsaDecrypt = (encryptedData: Buffer, privateKey: string): Buffer => {
  return crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    encryptedData,
  )
}

// DKD encryption (AES + RSA)
export const dkdEncrypt = async (
  data: Buffer,
  publicKey: string,
): Promise<{
  encryptedData: Buffer
  encryptedKey: Buffer
  iv: Buffer
}> => {
  // Generate AES key
  const aesKey = generateAESKey()

  // Encrypt data with AES
  const { encrypted: encryptedData, iv } = aesEncrypt(data, aesKey)

  // Encrypt AES key with RSA
  const encryptedKey = rsaEncrypt(aesKey, publicKey)

  return { encryptedData, encryptedKey, iv }
}

// DKD decryption (AES + RSA)
export const dkdDecrypt = async (
  encryptedData: Buffer,
  encryptedKey: Buffer,
  iv: Buffer,
  privateKey: string,
): Promise<Buffer> => {
  // Decrypt AES key with RSA
  const aesKey = rsaDecrypt(encryptedKey, privateKey)

  // Decrypt data with AES
  return aesDecrypt(encryptedData, aesKey, iv)
}
