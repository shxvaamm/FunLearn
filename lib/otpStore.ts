// Server-side ephemeral OTP storage for SMS verification
interface OtpEntry {
  phone: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

// In-memory global store (persists during Node.js server lifecycle)
const globalOtpStore = new Map<string, OtpEntry>();

/**
 * Store 6-digit OTP code for a phone number with a 5-minute expiry
 */
export function storePhoneOtp(phone: string, code: string): void {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  globalOtpStore.set(phone, {
    phone,
    code,
    expiresAt,
    attempts: 0,
  });
}

/**
 * Verify phone OTP code
 */
export function verifyPhoneOtp(phone: string, code: string): { success: boolean; message: string } {
  const entry = globalOtpStore.get(phone);
  if (!entry) {
    return { success: false, message: "No verification code requested for this phone number." };
  }

  if (Date.now() > entry.expiresAt) {
    globalOtpStore.delete(phone);
    return { success: false, message: "Verification code has expired. Please request a new one." };
  }

  entry.attempts += 1;
  if (entry.attempts > 5) {
    globalOtpStore.delete(phone);
    return { success: false, message: "Too many failed attempts. Please request a new code." };
  }

  if (entry.code !== code) {
    return { success: false, message: "Incorrect verification code. Please check your SMS and try again." };
  }

  // Code is valid → clear entry
  globalOtpStore.delete(phone);
  return { success: true, message: "Phone number verified successfully!" };
}
