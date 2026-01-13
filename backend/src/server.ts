import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { sql, insertRegistration, checkConnection } from "./db.js";
import { sendConfirmationEmail } from "./sendEmail.js";

// Registration request validation schema
const registrationSchema = t.Object({
    email: t.String({ format: "email" }),
    firstName: t.String({ minLength: 1, maxLength: 100 }),
    lastName: t.String({ minLength: 1, maxLength: 100 }),
    phone: t.String({ minLength: 9, maxLength: 20 }),
    company: t.String({ minLength: 1, maxLength: 255 }),
    businessType: t.String({ minLength: 1, maxLength: 100 }),
    position: t.String({ minLength: 1, maxLength: 100 }),
    companySize: t.String({ minLength: 1, maxLength: 50 }),
});

export const app = new Elysia()
    // CORS configuration for frontend
    .use(
        cors({
            origin: ["http://localhost:5173", "http://localhost:3001", "https://ai-emprie-registration.vercel.app"],
            methods: ["GET", "POST", "OPTIONS"],
            allowedHeaders: ["Content-Type"],
        })
    )
    // Health check endpoint
    .get("/health", async () => {
        const dbConnected = await checkConnection();
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            database: dbConnected ? "connected" : "disconnected",
        };
    })
    // Registration endpoint
    .post(
        "/api/register",
        async ({ body, set }) => {
            // Explicitly cast body to ensure TypeScript knows the structure
            const data = body as {
                email: string;
                firstName: string;
                lastName: string;
                phone: string;
                company: string;
                businessType: string;
                position: string;
                companySize: string;
            };

            try {
                // Insert registration into database
                const registration = await insertRegistration({
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    company: data.company,
                    businessType: data.businessType,
                    position: data.position,
                    companySize: data.companySize,
                });

                console.log(`Registration created: ID ${registration.id}`);

                // Send confirmation email
                const emailResult = await sendConfirmationEmail(
                    data.email,
                    data.firstName
                );

                if (!emailResult.success) {
                    console.warn(
                        `Email failed for ${data.email}: ${emailResult.error}`
                    );
                } else {
                    console.log(`Confirmation email sent: ${emailResult.messageId}`);
                }

                return {
                    success: true,
                    message: "Registration successful",
                    registrationId: registration.id,
                    emailSent: emailResult.success,
                };
            } catch (error) {
                console.error("Registration error:", error);

                if (
                    error instanceof Error &&
                    error.message.includes("unique constraint")
                ) {
                    set.status = 409;
                    return {
                        success: false,
                        message: "This email is already registered",
                    };
                }

                set.status = 500;
                return {
                    success: false,
                    message: "Registration failed. Please try again.",
                };
            }
        },
        {
            body: registrationSchema,
            error({ code, error, set }) {
                if (code === "VALIDATION") {
                    set.status = 400;
                    return {
                        success: false,
                        message: "Invalid request data",
                        errors: error.all,
                    };
                }
            },
        }
    );

// Only listen when running directly (not via export)
// @ts-ignore
if (import.meta.main) {
    const port = process.env.PORT || 3000;
    app.listen(port);
    console.log(
        `🚀 AIYA Event Registration API running on port ${port}`
    );
}

export type App = typeof app;
