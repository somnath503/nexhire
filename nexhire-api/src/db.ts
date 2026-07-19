import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'RECRUITER',
        company_name VARCHAR(255),
        industry VARCHAR(100),
        company_description TEXT,
        website_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        resume_url TEXT,
        github_url VARCHAR(255),
        title VARCHAR(255),
        education TEXT,
        experience TEXT,
        projects TEXT,
        skills TEXT,
        profile_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS otps (
        email VARCHAR(255) PRIMARY KEY,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        recruiter_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        stack VARCHAR(255) DEFAULT '',
        location VARCHAR(255) NOT NULL,
        employment_type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'PUBLISHED',
        applicants_count INT DEFAULT 0,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
        candidate_id INT REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'REVIEWING',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(job_id, candidate_id)
      );
    `);

    // BULLETPROOF PATCH
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS company_description TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS website_url VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_url TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS title VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS education TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS experience TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS projects TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS stack VARCHAR(255) DEFAULT '';
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS applicants_count INT DEFAULT 0;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT;
    `);

    console.log('✅ PostgreSQL Database tables verified and fully patched.');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    client.release();
  }
};