/*
  # Vehicle and Tire Size Cache Database
  
  1. New Tables
    - `vehicle_specs_cache`
      - Caches vehicle specifications from NHTSA API
      - Includes year, make, model, trim, and associated tire sizes
      - Prevents repeated API calls for same vehicle
    
    - `tire_sizes`
      - Stores all available tire sizes with vehicle associations
      - Links to vehicle specifications
      - Includes OEM and compatible sizes
    
  2. Indexes
    - Composite index on year, make, model, trim for fast lookups
    - Index on created_at for cache invalidation
  
  3. Security
    - Enable RLS on both tables
    - Allow public read access for tire finder
    - Restrict write access to authenticated users only
*/

-- Create vehicle_specs_cache table
CREATE TABLE IF NOT EXISTS vehicle_specs_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  trim text DEFAULT '',
  tire_sizes text[] NOT NULL,
  vehicle_type text,
  source text DEFAULT 'nhtsa',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tire_sizes table for detailed tire information
CREATE TABLE IF NOT EXISTS tire_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  size_code text UNIQUE NOT NULL,
  width int,
  aspect_ratio int,
  rim_diameter int,
  load_index int,
  speed_rating text,
  vehicle_types text[],
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicle_cache_lookup 
  ON vehicle_specs_cache(year, make, model, trim);

CREATE INDEX IF NOT EXISTS idx_vehicle_cache_created 
  ON vehicle_specs_cache(created_at);

CREATE INDEX IF NOT EXISTS idx_tire_sizes_code 
  ON tire_sizes(size_code);

-- Enable RLS
ALTER TABLE vehicle_specs_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE tire_sizes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicle_specs_cache
CREATE POLICY "Anyone can read vehicle specs cache"
  ON vehicle_specs_cache
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert vehicle specs"
  ON vehicle_specs_cache
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vehicle specs"
  ON vehicle_specs_cache
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for tire_sizes
CREATE POLICY "Anyone can read tire sizes"
  ON tire_sizes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert tire sizes"
  ON tire_sizes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tire sizes"
  ON tire_sizes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert common tire sizes
INSERT INTO tire_sizes (size_code, width, aspect_ratio, rim_diameter, vehicle_types)
VALUES
  ('185/65R15', 185, 65, 15, ARRAY['compact', 'sedan']),
  ('195/65R15', 195, 65, 15, ARRAY['compact', 'sedan']),
  ('205/55R16', 205, 55, 16, ARRAY['sedan', 'compact']),
  ('205/60R16', 205, 60, 16, ARRAY['sedan']),
  ('215/55R16', 215, 55, 16, ARRAY['sedan']),
  ('215/60R16', 215, 60, 16, ARRAY['sedan', 'crossover']),
  ('215/55R17', 215, 55, 17, ARRAY['sedan', 'crossover']),
  ('225/45R17', 225, 45, 17, ARRAY['sports', 'sedan']),
  ('225/50R17', 225, 50, 17, ARRAY['sedan', 'sports']),
  ('225/55R17', 225, 55, 17, ARRAY['sedan', 'crossover']),
  ('225/60R17', 225, 60, 17, ARRAY['suv', 'crossover']),
  ('225/65R17', 225, 65, 17, ARRAY['suv', 'crossover']),
  ('235/45R17', 235, 45, 17, ARRAY['sports', 'sedan']),
  ('235/50R18', 235, 50, 18, ARRAY['sedan', 'sports']),
  ('235/55R18', 235, 55, 18, ARRAY['crossover', 'suv']),
  ('235/60R18', 235, 60, 18, ARRAY['suv', 'crossover']),
  ('235/65R18', 235, 65, 18, ARRAY['suv']),
  ('245/40R18', 245, 40, 18, ARRAY['sports']),
  ('245/45R18', 245, 45, 18, ARRAY['sports', 'sedan']),
  ('245/60R18', 245, 60, 18, ARRAY['suv', 'truck']),
  ('245/70R17', 245, 70, 17, ARRAY['truck', 'suv']),
  ('255/35R19', 255, 35, 19, ARRAY['sports']),
  ('255/50R19', 255, 50, 19, ARRAY['suv', 'crossover']),
  ('255/55R18', 255, 55, 18, ARRAY['suv', 'truck']),
  ('255/70R18', 255, 70, 18, ARRAY['truck']),
  ('265/60R18', 265, 60, 18, ARRAY['truck', 'suv']),
  ('265/65R17', 265, 65, 17, ARRAY['truck', 'suv']),
  ('265/70R17', 265, 70, 17, ARRAY['truck']),
  ('275/55R20', 275, 55, 20, ARRAY['truck', 'suv']),
  ('275/60R20', 275, 60, 20, ARRAY['truck'])
ON CONFLICT (size_code) DO NOTHING;
