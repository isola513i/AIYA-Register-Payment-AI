import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
}

// Create postgres connection with NeonDB
// Using postgres.js which works great with Bun and Neon Serverless
export const sql = postgres(connectionString, {
    ssl: "require",
    max: 10, // Connection pool size
    idle_timeout: 20,
    connect_timeout: 10,
});

// Helper function to check database connection
export async function checkConnection(): Promise<boolean> {
    try {
        await sql`SELECT 1`;
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}

// Type for registration data
export interface RegistrationData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    company: string;
    businessType: string;
    position: string;
    companySize: string;
}

// Insert registration into database
export async function insertRegistration(data: RegistrationData) {
    const result = await sql`
    INSERT INTO registrations (
      email,
      first_name,
      last_name,
      phone,
      company,
      business_type,
      position,
      company_size
    ) VALUES (
      ${data.email},
      ${data.firstName},
      ${data.lastName},
      ${data.phone},
      ${data.company},
      ${data.businessType},
      ${data.position},
      ${data.companySize}
    )
    RETURNING id, created_at
  `;

    return result[0];
}

// Check if email already registered
export async function checkRegistration(email: string) {
    const result = await sql`
        SELECT id FROM registrations WHERE email = ${email} LIMIT 1
    `;
    return result.length > 0;
}

// Create new order
export async function createOrder(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    amount: number;
    packageType: string;
    referralCode?: string;
    slipUrl?: string; // Optional for now
}) {
    const result = await sql`
        INSERT INTO orders (
            first_name, last_name, email, phone, amount, package_type, referral_code, slip_url, status
        ) VALUES (
            ${data.firstName}, 
            ${data.lastName}, 
            ${data.email}, 
            ${data.phone}, 
            ${data.amount},
            ${data.packageType},
            ${data.referralCode || null}, 
            ${data.slipUrl || null}, 
            'paid'
        )
        RETURNING id
    `;
    return result[0];
}
