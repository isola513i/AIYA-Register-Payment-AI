import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES client
const sesClient = new SESClient({
    region: Bun.env.AWS_REGION || "ap-southeast-1",
    credentials: {
        accessKeyId: Bun.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: Bun.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const SENDER_EMAIL = Bun.env.SENDER_EMAIL || "noreply@aiya.ai";

// HTML email template with AIYA branding
function getEmailTemplate(firstName: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #041527 0%, #0a2540 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">AIYA</h1>
        <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px;">AI Business Bootcamp 2026</p>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #041527; margin: 0 0 20px 0; font-size: 24px;">Registration Confirmed! 🎉</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          สวัสดีค่ะ/ครับ คุณ${firstName},
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Thank you for registering for the <strong>AIYA Seminar</strong>. We're excited to have you join us!
        </p>
        
        <!-- Event Details Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #3A23B5 0%, #5C499D 100%); border-radius: 16px; margin: 30px 0;">
          <tr>
            <td style="padding: 30px;">
              <h3 style="color: #ffffff; margin: 0 0 20px 0; font-size: 18px;">📅 Event Details</h3>
              <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 10px 0;">
                <strong>Date:</strong> To be announced
              </p>
              <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 10px 0;">
                <strong>Time:</strong> To be announced
              </p>
              <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">
                <strong>Stream Link:</strong> Will be sent before the event
              </p>
            </td>
          </tr>
        </table>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          You will receive another email with the streaming link and calendar invite closer to the event date.
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">
          If you have any questions, please don't hesitate to reach out.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0;">
          © 2026 AIYA. All rights reserved.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          This email was sent because you registered for an AIYA event.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Send confirmation email
export async function sendConfirmationEmail(
    toEmail: string,
    firstName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const command = new SendEmailCommand({
            Source: SENDER_EMAIL,
            Destination: {
                ToAddresses: [toEmail],
            },
            Message: {
                Subject: {
                    Data: "Confirmation: AIYA Seminar Registration",
                    Charset: "UTF-8",
                },
                Body: {
                    Html: {
                        Data: getEmailTemplate(firstName),
                        Charset: "UTF-8",
                    },
                    Text: {
                        Data: `Hi ${firstName},\n\nThank you for registering for the AIYA Seminar. We're excited to have you join us!\n\nYou will receive the streaming link and calendar invite closer to the event date.\n\nBest regards,\nAIYA Team`,
                        Charset: "UTF-8",
                    },
                },
            },
        });

        const response = await sesClient.send(command);

        return {
            success: true,
            messageId: response.MessageId,
        };
    } catch (error) {
        console.error("Failed to send email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
