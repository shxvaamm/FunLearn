import { NextRequest, NextResponse } from "next/server";
import { storePhoneOtp } from "@/lib/otpStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // 10-digit standard Indian mobile number
    const nationalNumber = cleanPhone.slice(-10);
    const internationalNumber = `+91${nationalNumber}`;

    // Generate real 6-digit numeric OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    storePhoneOtp(nationalNumber, generatedOtp);
    storePhoneOtp(internationalNumber, generatedOtp);

    console.log(`\n======================================================`);
    console.log(`[FunLearn SMS OTP] 📱 Phone: +91 ${nationalNumber}`);
    console.log(`[FunLearn SMS OTP] 🔑 6-Digit OTP Code: ${generatedOtp}`);
    console.log(`======================================================\n`);

    let smsDispatched = false;
    let providerName = "Local SMS Service";

    // ── 1. Fast2SMS Provider (India) ─────────────────────────────────────────
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey && !fast2smsKey.includes("your-")) {
      try {
        const smsRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: fast2smsKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: "otp",
            variables_values: generatedOtp,
            numbers: nationalNumber,
          }),
        });
        const smsData = await smsRes.json();
        if (smsData.return === true || smsData.status_code === 200) {
          smsDispatched = true;
          providerName = "Fast2SMS India";
        }
      } catch (err) {
        console.error("[SMS Gateway] Fast2SMS error:", err);
      }
    }

    // ── 2. Twilio SMS Provider ────────────────────────────────────────────────
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

    if (!smsDispatched && twilioSid && twilioAuth && twilioFrom && !twilioSid.includes("your-")) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
        const params = new URLSearchParams();
        params.append("To", internationalNumber);
        params.append("From", twilioFrom);
        params.append("Body", `Your FunLearn student verification code is ${generatedOtp}. Valid for 5 minutes.`);

        const twilioRes = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });
        if (twilioRes.ok) {
          smsDispatched = true;
          providerName = "Twilio SMS";
        }
      } catch (err) {
        console.error("[SMS Gateway] Twilio error:", err);
      }
    }

    // ── 3. 2Factor SMS Provider ───────────────────────────────────────────────
    const twoFactorKey = process.env.TWO_FACTOR_API_KEY;
    if (!smsDispatched && twoFactorKey && !twoFactorKey.includes("your-")) {
      try {
        const url = `https://2factor.in/v1/API/V1/${twoFactorKey}/SMS/${nationalNumber}/${generatedOtp}/FunLearn+OTP`;
        const res2f = await fetch(url);
        if (res2f.ok) {
          smsDispatched = true;
          providerName = "2Factor SMS";
        }
      } catch (err) {
        console.error("[SMS Gateway] 2Factor error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: smsDispatched
        ? `6-digit verification code sent via ${providerName} to ${internationalNumber}.`
        : `6-digit verification code generated for ${internationalNumber}.`,
      phone: internationalNumber,
      smsDispatched,
      provider: providerName,
      // Provide preview when no SMS gateway key is configured in .env.local
      previewOtp: !smsDispatched ? generatedOtp : undefined,
    });
  } catch (error: any) {
    console.error("[API send-otp] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error while sending OTP" },
      { status: 500 }
    );
  }
}
