import DOMPurify from 'dompurify'

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - Raw user input
 * @returns Sanitized string safe for rendering
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove any HTML tags and dangerous content
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [] // No attributes allowed
  }).trim()
}

/**
 * Sanitize and validate email input
 * @param email - Email string to sanitize
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeInput(email)
  // Basic email validation - more comprehensive validation should be done with Zod
  return sanitized.toLowerCase()
}

/**
 * Sanitize numeric input (for amounts, limits, etc.)
 * @param input - Numeric input as string
 * @returns Sanitized numeric string
 */
export function sanitizeNumericInput(input: string): string {
  const sanitized = sanitizeInput(input)
  // Remove any non-numeric characters except decimal point
  return sanitized.replace(/[^0-9.]/g, '')
}

/**
 * Sanitize phone number input
 * @param phone - Phone number string
 * @returns Sanitized phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  const sanitized = sanitizeInput(phone)
  // Remove any non-numeric characters
  return sanitized.replace(/[^0-9]/g, '')
}

/**
 * Sanitize account name or description fields
 * @param text - Text input to sanitize
 * @returns Sanitized text with length limit
 */
export function sanitizeText(text: string, maxLength: number = 100): string {
  const sanitized = sanitizeInput(text)
  return sanitized.substring(0, maxLength)
}