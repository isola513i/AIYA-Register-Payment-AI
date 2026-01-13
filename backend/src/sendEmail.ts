import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@aiya.ai";

// HTML email template with "AIYA Dark Premium" branding
function getEmailTemplate(firstName: string): string {
  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ยืนยันการลงทะเบียน</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Sukhumvit Set', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #020c17;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width: 100%; background-color: #020c17; color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        
        <!-- Main Card -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #0b1623; border: 1px solid #1e293b; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Image/Banner Area -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: radial-gradient(circle at top, #1e1b4b 0%, #020c17 100%);">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(to right, #ffffff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: #ffffff;">AIYA</h1>
              <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">AI Business Bootcamp 2026</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 24px; text-align: center;">ลงทะเบียนสำเร็จ! 🎉</h2>
              
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                สวัสดีครับ คุณ <strong style="color: #ffffff;">${firstName}</strong>,
              </p>
              
              <div style="background-color: rgba(255,255,255,0.03); border-left: 4px solid #3A23B5; padding: 20px; border-radius: 8px; margin-bottom: 32px;">
                <h3 style="color: #ffffff; margin: 0 0 10px 0; font-size: 18px;">Master the AI Empire <br/><span style="color: #94a3b8; font-size: 16px; font-weight: normal;">Build Your Business.</span></h3>
                <p style="color: #cbd5e1; font-size: 14px; line-height: 1.8; margin: 0; font-style: italic;">
                  "โลกถล่มด้วย AI... ธุรกิจที่ใช้แรงงานคนแบบเดิมจะค่อยๆ หายไป<br/>
                  คุณจะปรับตัวหรือจะถูกทิ้งไว้ข้างหลัง"
                </p>
              </div>

              <!-- Event Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #3A23B5 0%, #5C499D 100%); border-radius: 16px; margin-bottom: 32px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(58, 35, 181, 0.3);">
                <tr>
                  <td style="padding: 30px;">
                    <h3 style="color: #ffffff; margin: 0 0 20px 0; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px;">📅 รายละเอียดงาน (Event Details)</h3>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <p style="color: rgba(255,255,255,0.8); font-size: 12px; text-transform: uppercase; margin: 0;">DATE</p>
                          <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 4px 0 0 0;">14 ม.ค. 2026</p>
                        </td>
                        <td style="padding-bottom: 12px;">
                          <p style="color: rgba(255,255,255,0.8); font-size: 12px; text-transform: uppercase; margin: 0;">TIME</p>
                          <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 4px 0 0 0;">14:30 น.</p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 12px;">
                           <p style="color: rgba(255,255,255,0.8); font-size: 12px; text-transform: uppercase; margin: 0;">STREAM LINK</p>
                           <a href="https://streamyard.com/watch/bfhnnc6NUcxt" style="display: inline-block; color: #ffffff; font-size: 14px; font-weight: 600; margin: 4px 0 0 0; text-decoration: none; border-bottom: 1px dashed rgba(255,255,255,0.5);">
                             👉 กดที่นี่เพื่อเข้าชม (StreamYard)
                           </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 0;">
                (ระบบจะส่ง Link ให้ท่านอีกครั้งทาง SMS และ Email ก่อนเริ่มงาน)
              </p>
            </td>
          </tr>

          <!-- Recommended Course Section -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="background-color: #FFF5E6; border-radius: 16px; padding: 30px; text-align: center; border: 1px solid #FED7AA;">
                
                <div style="display: inline-block; background-color: #EA580C; color: #ffffff; font-size: 10px; font-weight: bold; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 1px;">
                  Recommended Course
                </div>
                
                <h3 style="color: #9A3412; font-size: 22px; font-weight: 800; margin: 0 0 20px 0;">Generative AI Bootcamp</h3>
                
                <!-- Course Image -->
                <div style="width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                  <img src="https://framerusercontent.com/images/2e4a4802c6109e37cc60a5e84860183181812837.jpg" alt="Generative AI Bootcamp" style="width: 100%; height: auto; display: block;" />
                </div>
                
                <p style="color: #9A3412; font-size: 14px; line-height: 1.6; margin-bottom: 24px; font-weight: 500;">
                  อยากเก่ง AI แบบเจาะลึก? เรียนรู้การสร้าง AI Agent และ Automation เพื่อธุรกิจของคุณแบบเข้มข้น กับหลักสูตรที่ดีที่สุดจาก AIYA
                </p>
                
                <a href="https://web.aiya.ai/th/bootcamp/ai-empire" style="display: inline-block; background-color: #EA580C; color: #ffffff; font-size: 16px; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.3);">
                  ดูรายละเอียดหลักสูตร
                </a>

                <p style="color: #576d85; font-size: 14px; margin-top: 24px; font-style: italic;">
                  หวังว่าเครื่องมือนี้จะช่วยติดปีกให้ธุรกิจของคุณได้นะครับ<br>
                  แล้วพบกันในคลาสเรียนอีกครั้งครับ
                </p>

              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                © 2026 AIYA Co., Ltd. สงวนลิขสิทธิ์
              </p>
            </td>
          </tr>
        </table>

        <!-- Unsubscribe / Extra Info -->
        <p style="color: #475569; font-size: 12px; margin-top: 20px;">
          จดหมายนี้ถูกส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ
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
    console.log(`Attempting to send email to: ${toEmail}`);

    // Construct sender with display name
    // Format: "Display Name" <email@address.com>
    const sender = `AIYA <${SENDER_EMAIL}>`;

    const command = new SendEmailCommand({
      Source: sender, // Changed from SENDER_EMAIL to sender variable
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: "ยืนยันการลงทะเบียน: Master the AI Empire",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: getEmailTemplate(firstName),
            Charset: "UTF-8",
          },
          Text: {
            Data: `สวัสดีครับ คุณ ${firstName},\n\nลงทะเบียนสำเร็จ! Master the AI Empire\nBuild Your Business.\n\n"โลกถล่มด้วย AI... ธุรกิจที่ใช้แรงงานคนแบบเดิมจะค่อยๆ หายไป คุณจะปรับตัวหรือจะถูกทิ้งไว้ข้างหลัง"\n\nวันที่: 14 ม.ค. 2026\nเวลา: 14:30 น.\nLink: https://streamyard.com/watch/bfhnnc6NUcxt\n\nAIYA Team`,
            Charset: "UTF-8",
          },
        },
      },
    });

    const response = await sesClient.send(command);
    console.log(`Email sent successfully. MessageId: ${response.MessageId}`);

    return {
      success: true,
      messageId: response.MessageId,
    };
  } catch (error: any) {
    console.error("Failed to send email FULL ERROR:", JSON.stringify(error, null, 2));
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
