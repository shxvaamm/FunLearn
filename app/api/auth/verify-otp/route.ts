import { NextRequest, NextResponse } from "next/server";
import { verifyPhoneOtp } from "@/lib/otpStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, token, newPassword } = body;

    if (!phone || !token) {
      return NextResponse.json(
        { error: "Phone number and verification token are required." },
        { status: 400 }
      );
    }

    if (token.length !== 6) {
      return NextResponse.json(
        { error: "Verification code must be 6 digits." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const nationalNumber = cleanPhone.slice(-10);

    const result = verifyPhoneOtp(nationalNumber, token);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully!",
    });
  } catch (error: any) {
    console.error("[API verify-otp] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error while verifying OTP" },
      { status: 500 }
    );
  }
}
