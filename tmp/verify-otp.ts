import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testOtpFlow(email: string) {
  console.log(`--- Testing OTP Flow for ${email} ---`);

  // 1. Send OTP
  console.log("1. Sending OTP...");
  const sendRes = await fetch("http://localhost:3000/api/auth/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  
  const sendData = await sendRes.json();
  console.log("Send Result:", sendRes.status, sendData);

  if (!sendRes.ok) return;

  // 2. Fetch OTP from DB (since we are testing locally)
  const user = await prisma.user.findUnique({ where: { email } });
  const otp = user?.loginOtp;
  console.log("OTP from DB:", otp);

  if (!otp) {
    console.error("OTP not found in DB!");
    return;
  }

  // 3. Verify OTP
  console.log("2. Verifying OTP...");
  const verifyRes = await fetch("http://localhost:3000/api/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const verifyData = await verifyRes.json();
  console.log("Verify Result:", verifyRes.status, verifyData);
}

// Usage: provide an existing user email
const testEmail = process.argv[2] || "admin@example.com";
testOtpFlow(testEmail).catch(console.error);
