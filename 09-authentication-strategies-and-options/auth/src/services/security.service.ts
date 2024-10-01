import * as crypto from 'crypto'

export class SecurityService {
  // The app's fixed secret key for encryption and decryption
  private static readonly APP_DATA_SECRET_KEY = Buffer.from(
    process.env.APP_DATA_SECRET_KEY,
    'base64'
  )
  private static readonly APP_IV_LENGTH = 16 // AES block size

  /**
   * @description Encrypts data using AES-256-CBC encryption with the app's secret key.
   * @param data - The data to be encrypted.
   * @returns The encrypted data as a base64-encoded string with the IV prepended.
   */
  static encryptData(data: string): string {
    const iv = crypto.randomBytes(this.APP_IV_LENGTH)
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      this.APP_DATA_SECRET_KEY,
      iv
    )

    // Encrypt the data
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ])

    return iv.toString('base64') + ':' + encrypted.toString('base64')
  }

  /**
   * @description Decrypts data using AES-256-CBC decryption with the app's secret key.
   * @param data - The encrypted data as a base64-encoded string with the IV prepended.
   * @returns The decrypted data as a UTF-8 string.
   * @throws Error if the data cannot be decrypted.
   */
  static decryptData(data: string): string {
    const [ivBase64, encryptedBase64] = data.split(':')
    const iv = Buffer.from(ivBase64, 'base64')
    const encrypted = Buffer.from(encryptedBase64, 'base64')

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.APP_DATA_SECRET_KEY,
      iv
    )

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ])

    return decrypted.toString('utf8')
  }

  /**
   * @description Compare encrypted data
   * @param encryptedData - The encrypted data as a base64-encoded string with the IV prepended.
   * @param plainData - Plain data that used to compare
   * @returns Result of comparing (true/false)
   */
  static compare(encryptedData: string, data: string): boolean {
    const decryptedData = this.decryptData(encryptedData)

    return decryptedData === data
  }
}
