-- ==================================================
-- MIGRATION 001: Extensions
-- Purpose: Enable PostgreSQL extensions required for UUID generation & cryptographic hashing
-- ==================================================

-- Enable pgcrypto for gen_random_uuid() and hashing functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable uuid-ossp as fallback UUID utility
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

COMMENT ON EXTENSION "pgcrypto" IS 'Cryptographic functions & UUID v4 generation';
COMMENT ON EXTENSION "uuid-ossp" IS 'UUID generation functions';
