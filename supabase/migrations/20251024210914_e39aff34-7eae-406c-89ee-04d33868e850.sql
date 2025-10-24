-- Create table for vehicle tire sizes
CREATE TABLE public.vehicle_tire_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  tire_sizes TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_vehicle_tire_sizes_lookup ON public.vehicle_tire_sizes(year, make, model);

-- Enable Row Level Security
ALTER TABLE public.vehicle_tire_sizes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (this is reference data)
CREATE POLICY "Vehicle tire sizes are viewable by everyone" 
ON public.vehicle_tire_sizes 
FOR SELECT 
USING (true);

-- Insert comprehensive tire size data for 2024 models
INSERT INTO public.vehicle_tire_sizes (year, make, model, tire_sizes) VALUES
-- Toyota
('2024', 'Toyota', 'Camry', ARRAY['215/55R17', '235/45R18']),
('2024', 'Toyota', 'Corolla', ARRAY['205/55R16', '225/40R18']),
('2024', 'Toyota', 'RAV4', ARRAY['225/65R17', '235/55R19']),
('2024', 'Toyota', 'Highlander', ARRAY['245/60R18', '235/55R20']),
('2024', 'Toyota', 'Tacoma', ARRAY['265/70R16', '265/65R17']),
('2024', 'Toyota', 'Tundra', ARRAY['275/65R18', '275/55R20']),
('2024', 'Toyota', '4Runner', ARRAY['265/70R17', '265/65R18']),
('2024', 'Toyota', 'Prius', ARRAY['195/65R15', '215/45R17']),
-- Honda
('2024', 'Honda', 'Civic', ARRAY['215/55R16', '235/40R18']),
('2024', 'Honda', 'Accord', ARRAY['225/50R17', '235/40R19']),
('2024', 'Honda', 'CR-V', ARRAY['235/60R18', '235/55R19']),
('2024', 'Honda', 'Pilot', ARRAY['245/60R18', '255/50R20']),
('2024', 'Honda', 'Odyssey', ARRAY['235/60R18', '235/55R19']),
('2024', 'Honda', 'Ridgeline', ARRAY['245/60R18', '245/50R20']),
-- Ford
('2024', 'Ford', 'F-150', ARRAY['265/70R17', '275/55R20', '275/65R18']),
('2024', 'Ford', 'Mustang', ARRAY['235/55R17', '255/40R19', '275/40R19']),
('2024', 'Ford', 'Explorer', ARRAY['255/55R20', '265/45R21']),
('2024', 'Ford', 'Escape', ARRAY['225/60R18', '235/45R19']),
('2024', 'Ford', 'Edge', ARRAY['245/60R18', '245/50R20']),
('2024', 'Ford', 'Bronco', ARRAY['255/70R18', '285/70R17', '315/70R17']),
-- Chevrolet
('2024', 'Chevrolet', 'Silverado 1500', ARRAY['265/70R17', '275/60R20']),
('2024', 'Chevrolet', 'Equinox', ARRAY['225/65R17', '235/50R19']),
('2024', 'Chevrolet', 'Traverse', ARRAY['255/65R18', '255/55R20']),
('2024', 'Chevrolet', 'Malibu', ARRAY['225/55R17', '245/40R19']),
('2024', 'Chevrolet', 'Tahoe', ARRAY['275/60R20', '285/45R22']),
('2024', 'Chevrolet', 'Suburban', ARRAY['275/60R20', '285/45R22']),
-- BMW
('2024', 'BMW', '3 Series', ARRAY['225/50R17', '225/45R18', '225/40R19']),
('2024', 'BMW', '5 Series', ARRAY['245/45R18', '245/40R19']),
('2024', 'BMW', 'X3', ARRAY['225/60R18', '245/50R19']),
('2024', 'BMW', 'X5', ARRAY['255/55R18', '275/45R20']),
-- Mercedes-Benz
('2024', 'Mercedes-Benz', 'C-Class', ARRAY['225/50R17', '225/45R18']),
('2024', 'Mercedes-Benz', 'E-Class', ARRAY['245/45R18', '245/40R19']),
('2024', 'Mercedes-Benz', 'GLC', ARRAY['235/60R18', '255/45R20']),
('2024', 'Mercedes-Benz', 'GLE', ARRAY['255/55R19', '275/50R20']),
-- Tesla
('2024', 'Tesla', 'Model 3', ARRAY['235/45R18', '235/40R19']),
('2024', 'Tesla', 'Model Y', ARRAY['255/45R19', '255/40R20']),
('2024', 'Tesla', 'Model S', ARRAY['245/45R19', '265/35R21']),
('2024', 'Tesla', 'Model X', ARRAY['255/45R20', '265/35R22']),
-- Nissan
('2024', 'Nissan', 'Altima', ARRAY['215/60R16', '235/40R19']),
('2024', 'Nissan', 'Sentra', ARRAY['205/55R16', '215/45R18']),
('2024', 'Nissan', 'Rogue', ARRAY['225/65R17', '235/55R19']),
('2024', 'Nissan', 'Pathfinder', ARRAY['235/65R18', '255/60R18']),
-- Hyundai
('2024', 'Hyundai', 'Elantra', ARRAY['195/65R15', '225/45R17']),
('2024', 'Hyundai', 'Sonata', ARRAY['215/55R17', '235/40R19']),
('2024', 'Hyundai', 'Tucson', ARRAY['225/60R17', '235/55R19']),
('2024', 'Hyundai', 'Santa Fe', ARRAY['235/65R17', '245/50R20']),
-- Additional popular models
('2024', 'Kia', 'Forte', ARRAY['195/65R15', '225/40R18']),
('2024', 'Kia', 'Sportage', ARRAY['225/60R17', '235/55R19']),
('2024', 'Subaru', 'Outback', ARRAY['225/65R17', '225/60R18']),
('2024', 'Subaru', 'Forester', ARRAY['225/60R17', '225/55R18']),
('2024', 'Mazda', 'CX-5', ARRAY['225/65R17', '225/55R19']),
('2024', 'Mazda', 'Mazda3', ARRAY['205/60R16', '215/45R18']),
('2024', 'Jeep', 'Wrangler', ARRAY['245/75R17', '255/70R18', '285/70R17']),
('2024', 'Jeep', 'Grand Cherokee', ARRAY['265/60R18', '265/50R20']),
('2024', 'Ram', '1500', ARRAY['275/55R20', '285/45R22']),
('2024', 'Volkswagen', 'Jetta', ARRAY['205/55R16', '225/40R18']),
('2024', 'Volkswagen', 'Tiguan', ARRAY['235/55R18', '235/50R19']);
