-- AIYA Event Registration Database Schema
-- Compatible with NeonDB (PostgreSQL)

-- Create registrations table
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
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- Create index on created_at for sorting/filtering by date
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);

-- Example insert (for testing)
-- INSERT INTO registrations (email, first_name, last_name, phone, company, business_type, position, company_size)
-- VALUES ('test@example.com', 'John', 'Doe', '0812345678', 'AIYA', 'Technology', 'Developer', '11-50');
