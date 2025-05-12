import nodemailer from "nodemailer"

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "uplink@codehomie.chat",
    pass: process.env.EMAIL_PASSWORD, // Store password in environment variable
  },
})

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  try {
    const info = await transporter.sendMail({
      from: '"Code Homie" <uplink@codehomie.chat>',
      to,
      subject,
      text: text || "",
      html,
    })

    console.log("Message sent: %s", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

// Welcome email template
export function getWelcomeEmailTemplate(name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codehomie.chat"

  return {
    subject: "Welcome to Code Homie!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #18181b; padding: 20px; text-align: center; border-radius: 4px 4px 0 0;">
          <img src="${appUrl}/images/code-homie-logo.png" alt="Code Homie" width="100" style="border-radius: 8px;">
          <h1 style="color: white; margin-top: 10px;">Welcome to Code Homie!</h1>
        </div>
        <div style="padding: 20px; background-color: #27272a; color: #e4e4e7; border-radius: 0 0 4px 4px;">
          <p>Hey ${name || "there"},</p>
          <p>Thanks for joining Code Homie! We're excited to have you on board.</p>
          <p>With Code Homie, you can:</p>
          <ul>
            <li>Get AI-powered coding assistance</li>
            <li>Debug your code with expert help</li>
            <li>Generate code snippets and solutions</li>
            <li>Learn programming concepts</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/chat" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Start Coding Now</a>
          </div>
          <p>If you have any questions, just reply to this email or use the chat support on our website.</p>
          <p>Happy coding!</p>
          <p>The Code Homie Team</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #71717a; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Code Homie. All rights reserved.</p>
          <p>
            <a href="${appUrl}/privacy" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
            <a href="${appUrl}/terms" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Terms of Service</a>
          </p>
        </div>
      </div>
    `,
    text: `Welcome to Code Homie!\n\nHey ${name || "there"},\n\nThanks for joining Code Homie! We're excited to have you on board.\n\nWith Code Homie, you can:\n- Get AI-powered coding assistance\n- Debug your code with expert help\n- Generate code snippets and solutions\n- Learn programming concepts\n\nIf you have any questions, just reply to this email or use the chat support on our website.\n\nHappy coding!\nThe Code Homie Team`,
  }
}
