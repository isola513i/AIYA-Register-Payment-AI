import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { sql, insertRegistration, checkConnection } from "./db";
import { sendConfirmationEmail } from "./sendEmail";

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

const app = new Elysia()
    // CORS configuration for frontend
    .use(
        cors({
            origin: ["http://localhost:5173", "http://localhost:3001"],
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
            try {
                // Insert registration into database
                const registration = await insertRegistration({
                    email: body.email,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    phone: body.phone,
                    company: body.company,
                    businessType: body.businessType,
                    position: body.position,
                    companySize: body.companySize,
                });

                console.log(`Registration created: ID ${registration.id}`);

                // Send confirmation email
                const emailResult = await sendConfirmationEmail(
                    body.email,
                    body.firstName
                );

                if (!emailResult.success) {
                    console.warn(
                        `Email failed for ${body.email}: ${emailResult.error}`
                    );
                    // Don't fail the request if email fails - registration is still valid
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

                // Handle duplicate email error
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
    )
    // Start server
    .listen(3000);

console.log(
    `🚀 AIYA Event Registration API running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
