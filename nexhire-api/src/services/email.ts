import dotenv from "dotenv";
dotenv.config();

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY as string,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "NexHire", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email }],
      subject: "Your NexHire Verification Code",
      htmlContent: `
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
    console.error("Brevo API error:", errText);
    throw new Error("Failed to send OTP email");
  }

  console.log(`✅ OTP email sent to ${email}`);
};