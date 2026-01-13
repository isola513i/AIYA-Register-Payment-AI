// Setup script to create the registrations table in NeonDB
import postgres from "postgres";

const connectionString = Bun.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ DATABASE_URL not found in environment");
    process.exit(1);
}

const sql = postgres(connectionString, { ssl: "require" });

async function setup() {
    console.log("🔄 Connecting to NeonDB...");

    try {
        // Create registrations table
        await sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        company VARCHAR(255) NOT NULL,
        business_type VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        company_size VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
        console.log("✅ Table 'registrations' created (or already exists)");

        // Create indexes
        await sql`
      CREATE INDEX IF NOT EXISTS idx_registrations_email 
      ON registrations(email)
    `;
        await sql`
      CREATE INDEX IF NOT EXISTS idx_registrations_created_at 
      ON registrations(created_at)
    `;
        console.log("✅ Indexes created");

        console.log("\n🎉 Database setup complete!");
    } catch (error) {
        console.error("❌ Setup failed:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

setup();
