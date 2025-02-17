import * as crypto from 'crypto'

// Add debug logging
console.log('Environment variables loaded:', {
    hasKey: !!process.env.ENCRYPTION_KEY,
    keyLength: process.env.ENCRYPTION_KEY?.length,
    keyStart: process.env.ENCRYPTION_KEY?.substring(0, 8)
})

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-fallback-key-min-32-chars-long!!'
const ALGORITHM = 'aes-256-cbc'

// Add key validation
function validateKey() {
    if (!process.env.ENCRYPTION_KEY) {
        console.error('No ENCRYPTION_KEY found in environment!')
        return false
    }
    
    console.log('Key validation:', {
        originalLength: process.env.ENCRYPTION_KEY.length,
        isValidHex: /^[0-9a-f]+$/i.test(process.env.ENCRYPTION_KEY)
    })
    return process.env.ENCRYPTION_KEY.length === 64
}

if (!validateKey()) {
    throw new Error('Invalid key length')
}

export function encrypt(text: string): string {
    console.log('Starting encryption...')
    console.log('Creating IV...')
    const iv = crypto.randomBytes(16)
    
    console.log('Creating cipher...')
    console.log('Key length before Buffer:', ENCRYPTION_KEY.length)
    console.log('Creating Buffer from key...')
    const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex')
    console.log('Key buffer length:', keyBuffer.length)
    
    try {
        const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv)
        console.log('Cipher created successfully')
        
        let encrypted = cipher.update(text)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`
    } catch (error) {
        console.error('Encryption error:', error)
        throw error
    }
}

export function decrypt(text: string): string {
    console.log('Decrypting text...')
    console.log('Text to decrypt:', text)
    const [ivHex, encryptedHex] = text.split(':')
    console.log('IV hex length:', ivHex.length)
    console.log('Encrypted hex length:', encryptedHex.length)
    
    const iv = Buffer.from(ivHex, 'hex')
    const encrypted = Buffer.from(encryptedHex, 'hex')
    console.log('IV buffer length:', iv.length)
    console.log('Encrypted buffer length:', encrypted.length)
    
    try {
        const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex')
        console.log('Key buffer length:', keyBuffer.length)
        const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv)
        let decrypted = decipher.update(encrypted)
        decrypted = Buffer.concat([decrypted, decipher.final()])
        return decrypted.toString()
    } catch (error) {
        console.error('Decryption error:', error)
        throw error
    }
} 