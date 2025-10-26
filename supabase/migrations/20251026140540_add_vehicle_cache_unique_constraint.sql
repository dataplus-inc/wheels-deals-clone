/*
  # Add Unique Constraint for Vehicle Cache
  
  1. Changes
    - Add unique constraint on (year, make, model, trim) combination
    - This allows proper upsert operations in the get-tire-sizes function
    - Prevents duplicate vehicle entries in the cache
  
  2. Notes
    - Uses DO block to check if constraint already exists
    - Safe to run multiple times
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'vehicle_specs_cache_unique'
  ) THEN
    ALTER TABLE vehicle_specs_cache 
    ADD CONSTRAINT vehicle_specs_cache_unique 
    UNIQUE (year, make, model, trim);
  END IF;
END $$;
