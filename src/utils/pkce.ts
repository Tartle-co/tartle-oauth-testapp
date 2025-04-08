'use client'

export const generatePkcePair = async () => {
  const codeVerifier = generateSecureString()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  return { codeVerifier, codeChallenge }
}

export const generateSecureString = (length: number = 64) => {
  // Produces a 64 character string when encoded to base64
  const buffer = new Uint8Array(Math.ceil(length * 0.75))
  crypto.getRandomValues(buffer)

  const encoded = base64URLEncode(buffer)
  return encoded.slice(0, length)
}

// Generate a PKCE code challenge from the verifier using SHA-256
const generateCodeChallenge = async (codeVerifier: string) => {
  if (!codeVerifier) {
    return ''
  }
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return base64URLEncode(new Uint8Array(hashBuffer))
}

const base64URLEncode = (buffer: Buffer | Uint8Array): string => {
  // Get standard base64 and convert to base64url format

  const base64 = bufferToBase64(buffer)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Equivalent of buffer.toString('base64') for browser environments
const bufferToBase64 = (buffer: Buffer | Uint8Array): string => {
  // Create a byte array from the buffer
  const bytes = new Uint8Array(buffer)

  // Base64 encoding implementation
  const base64Chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let result = ''

  // Process the bytes in groups of 3
  for (let i = 0; i < bytes.length; i += 3) {
    // Get the values of this group of 3 bytes
    const byte1 = bytes[i]
    const byte2 = i + 1 < bytes.length ? bytes[i + 1] : 0
    const byte3 = i + 2 < bytes.length ? bytes[i + 2] : 0

    // Convert to 4 base64 characters
    const char1 = base64Chars[byte1 >> 2]
    const char2 = base64Chars[((byte1 & 3) << 4) | (byte2 >> 4)]
    const char3 =
      i + 1 < bytes.length
        ? base64Chars[((byte2 & 15) << 2) | (byte3 >> 6)]
        : '='
    const char4 = i + 2 < bytes.length ? base64Chars[byte3 & 63] : '='

    result += char1 + char2 + char3 + char4
  }

  return result
}

export const verifyPKCEPair = async (
  codeVerifier: string,
  codeChallenge: string,
) => {
  const generatedCodeChallenge = await generateCodeChallenge(codeVerifier)
  return generatedCodeChallenge === codeChallenge
}
