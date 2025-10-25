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
    const { year, make } = await req.json();
    
    if (!year || !make) {
      return new Response(
        JSON.stringify({ error: 'Year and make are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Fetching models for ${year} ${make}`);

    // Fetch models from NHTSA API
    const makeEncoded = encodeURIComponent(make);
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${makeEncoded}/modelyear/${year}?format=json`
    );

    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract and sort models
    const models = data.Results
      .map((item: any) => item.Model_Name)
      .filter((model: string) => model && model.trim() !== '')
      .sort();

    // Remove duplicates
    const uniqueModels = [...new Set(models)];

    console.log(`Found ${uniqueModels.length} models for ${make}`);

    return new Response(
      JSON.stringify({ models: uniqueModels }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching models:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
