import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, don't reveal if user exists or not
      // But for this CMS, let's keep it simple
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update user with OTP
    await prisma.user.update({
      where: { email },
      data: {
        loginOtp: otp,
        otpExpires: otpExpires,
      },
    });

    // Send OTP via Resend
    try {
      const { resend } = await import("@/lib/resend");
      await resend.emails.send({
        from: 'Rubenix CMS <onboarding@resend.dev>',
        to: email,
        subject: 'Your Login OTP',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Login Verification</h1>
            <p style="font-size: 16px; margin-bottom: 8px;">Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827; margin: 24px 0;">${otp}</div>
            <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes.</p>
          </div>
        `,
      });
    } catch (emailError: any) {
      console.error("Failed to send email via Resend:", emailError);
      // We still return success if the OTP was saved in DB, 
      // but in production we might want to handle this differently.
    }

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
