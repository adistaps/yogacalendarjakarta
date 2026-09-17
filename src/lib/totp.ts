import crypto from 'crypto'

/**
 * Decodes a Base32 string into a Uint8Array byte buffer.
 * Google Authenticator secrets are base32-encoded.
 */
function decodeBase32(val: string): Uint8Array {
  const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const cleanVal = val.toUpperCase().replace(/=+$/, '')
  const len = cleanVal.length
  const bin: number[] = []
  let buffer = 0
  let bitsLeft = 0

  for (let i = 0; i < len; i++) {
    const idx = base32chars.indexOf(cleanVal[i])
    if (idx === -1) {
      throw new Error(`Invalid base32 character: ${cleanVal[i]}`)
    }
    buffer = (buffer << 5) | idx
    bitsLeft += 5
    if (bitsLeft >= 8) {
      bin.push((buffer >> (bitsLeft - 8)) & 0xff)
      bitsLeft -= 8
    }
  }

  return new Uint8Array(bin)
}

/**
 * Generates a random Base32 secret key of specified character length.
 */
export function generateSecret(length = 16): string {
  const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const bytes = crypto.randomBytes(length)
  let secret = ''
  for (let i = 0; i < length; i++) {
    secret += base32chars[bytes[i] % 32]
  }
  return secret
}

/**
 * Generates a 6-digit TOTP code for a specific 30-second counter window.
 */
function getTOTPAtCounter(secret: string, counter: number): string {
  const key = decodeBase32(secret)
  const buffer = Buffer.alloc(8)
  
  // Write counter as 64-bit big-endian integer
  let tmp = counter
  for (let i = 7; i >= 0; i--) {
    buffer[i] = tmp & 0xff
    tmp = Math.floor(tmp / 256)
  }

  const hmac = crypto.createHmac('sha1', key)
  hmac.update(buffer)
  const hash = hmac.digest()

  const offset = hash[hash.length - 1] & 0xf
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)

  const otp = binary % 1000000
  return otp.toString().padStart(6, '0')
}

/**
 * Verifies a 6-digit TOTP code against the secret key.
 * Allows a clock drift window of ±1 step (30 seconds) by default.
 */
export function verifyTOTP(secret: string, code: string, window = 1): boolean {
  const counter = Math.floor(Date.now() / 1000 / 30)
  const cleanCode = code.trim()

  for (let i = -window; i <= window; i++) {
    if (getTOTPAtCounter(secret, counter + i) === cleanCode) {
      return true
    }
  }

  return false
}

/**
 * Signs a session string for the 2FA verified cookie.
 */
export function signSession(userId: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-jwt-backup-secret-key'
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  const payload = `${userId}:${expiresAt}`
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}:${signature}`
}

/**
 * Verifies a signed session token from a cookie.
 * Returns the userId if valid and unexpired, otherwise null.
 */
export function verifySession(token: string | undefined): string | null {
  if (!token) return null
  const parts = token.split(':')
  if (parts.length !== 3) return null

  const [userId, expiresAtStr, signature] = parts
  const expiresAt = parseInt(expiresAtStr, 10)

  if (isNaN(expiresAt) || expiresAt < Date.now()) return null

  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-jwt-backup-secret-key'
  const payload = `${userId}:${expiresAt}`
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  if (signature !== expectedSignature) return null
  return userId
}

/**
 * Signs a pending TOTP secret for the client-side setup form.
 */
export function signPendingSecret(secret: string, userId: string): string {
  const serverSecret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-jwt-backup-secret-key'
  const expiresAt = Date.now() + 10 * 60 * 1000 // valid for 10 minutes
  const payload = `${secret}:${userId}:${expiresAt}`
  const signature = crypto.createHmac('sha256', serverSecret).update(payload).digest('hex')
  return `${payload}:${signature}`
}

/**
 * Verifies a signed pending secret token from the client-side setup form.
 */
export function verifyPendingSecret(token: string, userId: string): string | null {
  const parts = token.split(':')
  if (parts.length !== 4) return null

  const [secret, tokenUserId, expiresAtStr, signature] = parts
  if (tokenUserId !== userId) return null

  const expiresAt = parseInt(expiresAtStr, 10)
  if (isNaN(expiresAt) || expiresAt < Date.now()) return null

  const serverSecret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-jwt-backup-secret-key'
  const payload = `${secret}:${userId}:${expiresAt}`
  const expectedSignature = crypto.createHmac('sha256', serverSecret).update(payload).digest('hex')

  if (signature !== expectedSignature) return null
  return secret
}
