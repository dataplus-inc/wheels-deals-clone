import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { year } = await req.json();
    
    if (!year) {
      return new Response(
        JSON.stringify({ error: 'Year is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Fetching makes for year: ${year}`);

    // Fetch all makes from NHTSA API
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`
    );

    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract and sort makes
    const makes = data.Results
      .map((item: any) => item.MakeName)
      .filter((make: string) => make && make.trim() !== '')
      .sort();

    // Remove duplicates
    const uniqueMakes = [...new Set(makes)];

    console.log(`Found ${uniqueMakes.length} makes`);

    return new Response(
      JSON.stringify({ makes: uniqueMakes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching makes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
