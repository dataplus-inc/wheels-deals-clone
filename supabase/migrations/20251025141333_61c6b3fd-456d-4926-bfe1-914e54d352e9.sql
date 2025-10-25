-- Add more comprehensive trim data for popular vehicles
-- Infiniti Q50 trims for multiple years
INSERT INTO vehicle_tire_sizes (year, make, model, trim, tire_sizes) VALUES
-- 2024 Infiniti Q50
('2024', 'INFINITI', 'Q50', 'Pure', ARRAY['225/55R17']),
('2024', 'INFINITI', 'Q50', 'Luxe', ARRAY['225/55R17']),
('2024', 'INFINITI', 'Q50', 'Sensory', ARRAY['225/50R18']),
('2024', 'INFINITI', 'Q50', 'Red Sport 400', ARRAY['245/40R19']),
('2024', 'INFINITI', 'Q50', 'Signature Edition', ARRAY['245/40R19']),
-- 2023 Infiniti Q50
('2023', 'INFINITI', 'Q50', 'Pure', ARRAY['225/55R17']),
('2023', 'INFINITI', 'Q50', 'Luxe', ARRAY['225/55R17']),
('2023', 'INFINITI', 'Q50', 'Sensory', ARRAY['225/50R18']),
('2023', 'INFINITI', 'Q50', 'Red Sport 400', ARRAY['245/40R19']),
('2023', 'INFINITI', 'Q50', 'Signature Edition', ARRAY['245/40R19']),
-- 2022 Infiniti Q50
('2022', 'INFINITI', 'Q50', 'Pure', ARRAY['225/55R17']),
('2022', 'INFINITI', 'Q50', 'Luxe', ARRAY['225/55R17']),
('2022', 'INFINITI', 'Q50', 'Sensory', ARRAY['225/50R18']),
('2022', 'INFINITI', 'Q50', 'Red Sport 400', ARRAY['245/40R19']),
('2022', 'INFINITI', 'Q50', 'Signature Edition', ARRAY['245/40R19']),
-- 2021 Infiniti Q50
('2021', 'INFINITI', 'Q50', 'Pure', ARRAY['225/55R17']),
('2021', 'INFINITI', 'Q50', 'Luxe', ARRAY['225/55R17']),
('2021', 'INFINITI', 'Q50', 'Sensory', ARRAY['225/50R18']),
('2021', 'INFINITI', 'Q50', 'Red Sport 400', ARRAY['245/40R19']),
('2021', 'INFINITI', 'Q50', 'Signature Edition', ARRAY['245/40R19']),
-- 2020 Infiniti Q50
('2020', 'INFINITI', 'Q50', 'Pure', ARRAY['225/55R17']),
('2020', 'INFINITI', 'Q50', 'Luxe', ARRAY['225/55R17']),
('2020', 'INFINITI', 'Q50', 'Sensory', ARRAY['225/50R18']),
('2020', 'INFINITI', 'Q50', 'Red Sport 400', ARRAY['245/40R19']),
('2020', 'INFINITI', 'Q50', 'Red Sport 400 AWD', ARRAY['245/40R19', '265/35R19']),
('2020', 'INFINITI', 'Q50', 'Signature Edition', ARRAY['245/40R19']),

-- Add trims for other popular Infiniti models
-- QX50
('2024', 'INFINITI', 'QX50', 'Pure', ARRAY['235/55R19']),
('2024', 'INFINITI', 'QX50', 'Luxe', ARRAY['235/55R19']),
('2024', 'INFINITI', 'QX50', 'Sensory', ARRAY['235/55R19']),
('2024', 'INFINITI', 'QX50', 'Autograph', ARRAY['255/45R20']),

-- Add trims for popular Honda models
('2024', 'Honda', 'Accord', 'LX', ARRAY['225/50R17']),
('2024', 'Honda', 'Accord', 'Sport', ARRAY['235/40R19']),
('2024', 'Honda', 'Accord', 'EX-L', ARRAY['225/50R17']),
('2024', 'Honda', 'Accord', 'Touring', ARRAY['235/40R19']),
('2024', 'Honda', 'Accord', 'Hybrid Sport', ARRAY['235/40R19']),

-- Add trims for popular Toyota models
('2024', 'Toyota', 'Camry', 'LE', ARRAY['215/55R17']),
('2024', 'Toyota', 'Camry', 'SE', ARRAY['235/45R18']),
('2024', 'Toyota', 'Camry', 'XLE', ARRAY['235/45R18']),
('2024', 'Toyota', 'Camry', 'XSE', ARRAY['235/45R18']),
('2024', 'Toyota', 'Camry', 'TRD', ARRAY['235/40R19']),

('2024', 'Toyota', 'RAV4', 'LE', ARRAY['225/65R17']),
('2024', 'Toyota', 'RAV4', 'XLE', ARRAY['225/65R17']),
('2024', 'Toyota', 'RAV4', 'XLE Premium', ARRAY['225/60R18']),
('2024', 'Toyota', 'RAV4', 'Adventure', ARRAY['225/60R18']),
('2024', 'Toyota', 'RAV4', 'TRD Off-Road', ARRAY['225/60R18']),
('2024', 'Toyota', 'RAV4', 'Limited', ARRAY['225/60R18']),
('2024', 'Toyota', 'RAV4', 'Prime XSE', ARRAY['235/55R19']),
('2024', 'Toyota', 'RAV4', 'Prime SE', ARRAY['235/55R19'])

ON CONFLICT DO NOTHING;