-- Add trim column to vehicle_tire_sizes table
ALTER TABLE vehicle_tire_sizes 
ADD COLUMN IF NOT EXISTS trim text;

-- Update the unique constraint to include trim
DROP INDEX IF EXISTS idx_vehicle_tire_sizes_lookup;
CREATE INDEX idx_vehicle_tire_sizes_lookup ON vehicle_tire_sizes(year, make, model, trim);

-- Add some sample data with trims for 2024 models
INSERT INTO vehicle_tire_sizes (year, make, model, trim, tire_sizes) VALUES
('2024', 'Honda', 'Civic', 'LX', ARRAY['215/55R16']),
('2024', 'Honda', 'Civic', 'Sport', ARRAY['235/40R18']),
('2024', 'Honda', 'Civic', 'EX', ARRAY['215/50R17']),
('2024', 'Honda', 'Civic', 'Touring', ARRAY['235/40R18']),
('2024', 'Toyota', 'Camry', 'LE', ARRAY['215/55R17']),
('2024', 'Toyota', 'Camry', 'SE', ARRAY['235/45R18']),
('2024', 'Toyota', 'Camry', 'XLE', ARRAY['235/45R18']),
('2024', 'Toyota', 'Camry', 'TRD', ARRAY['235/40R19'])
ON CONFLICT DO NOTHING;