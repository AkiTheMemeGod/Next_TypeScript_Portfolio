BEGIN;

-- Add a simple navigation link to the main page
-- This migration is just to ensure the database is up to date
-- The actual navigation is handled by the Next.js routing

SELECT 1 as migration_complete;

COMMIT;