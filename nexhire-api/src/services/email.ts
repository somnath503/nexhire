import dotenv from "dotenv";
dotenv.config();

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "NexHire <onboarding@resend.dev>",
      to: email,
      subject: "Your NexHire Verification Code",
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px;background:#f4f6f8;">
          <div style="max-width:500px;margin:auto;background:white;border-radius:10px;padding:30px;border:1px solid #e5e5e5;">
            <h2 style="color:#2563eb;text-align:center;">NexHire Email Verification</h2>
            <p>Hello,</p>
            <p>Use the following One-Time Password (OTP) to complete your registration.</p>
            <div style="margin:30px 0;text-align:center;font-size:34px;letter-spacing:8px;font-weight:bold;color:#111827;">
              ${otp}
            </div>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If you didn't request this verification, simply ignore this email.</p>
            <hr>
            <p style="font-size:12px;color:#888;text-align:center;">© NexHire Recruitment Platform</p>
          </div>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Resend API error:", errText);
    throw new Error("Failed to send OTP email");
  }

  console.log(`✅ OTP email sent to ${email}`);
};