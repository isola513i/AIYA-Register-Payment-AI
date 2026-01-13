import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { sql, insertRegistration, checkConnection, checkRegistration, createOrder } from "./db.js";
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

            // Setup DB endpoint
            .get("/api/setup-db", async () => {
                const { setupDatabase } = await import("./setupDb.js");
                return await setupDatabase();
            })
            // Check registration endpoint
            .get("/api/check-registration", async ({ query }) => {
                const email = (query as { email?: string }).email;
                if (!email) return { exists: false };

                const exists = await checkRegistration(email);
                return { exists };
            })
            // Order endpoint
            .post("/api/orders", async ({ body, set }) => {
                const data = body as {
                    firstName: string;
                    lastName: string;
                    email: string;
                    phone: string;
                    amount: number;
                    packageType: string;
                    referralCode?: string;
                };

                try {
                    const order = await createOrder({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone,
                        amount: data.amount,
                        packageType: data.packageType || 'SINGLE',
                        referralCode: data.referralCode,
                    });

                    // --- INTEGRATION POINT: Sync Order to Company API ---
                    // Fire-and-forget: Do not await this if you don't want to block the user
                    (async () => {
                        try {
                            // TODO: Replace with your actual Company API URL
                            // const response = await fetch('https://api.yourcompany.com/v1/orders/sync', {
                            //     method: 'POST',
                            //     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_TOKEN' },
                            //     body: JSON.stringify({
                            //         external_id: order.id,
                            //         customer: {
                            //             first_name: data.firstName,
                            //             last_name: data.lastName,
                            //             email: data.email,
                            //             phone: data.phone
                            //         },
                            //         items: [{
                            //             sku: data.packageType,
                            //             price: data.amount,
                            //             quantity: 1
                            //         }],
                            //         referral_code: data.referralCode
                            //     })
                            // });
                            // if (!response.ok) console.error('Failed to sync order to company API');
                            console.log('Syncing order to company API... (Mock)');
                        } catch (err) {
                            console.error('Error syncing order:', err);
                        }
                    })();

                    return { success: true, orderId: order.id };
                } catch (error) {
                    console.error(error);
                    set.status = 500;
                    return { success: false, message: "Order failed" };
                }
            });

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
