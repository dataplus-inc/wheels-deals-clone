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
    const { year, make, model } = await req.json();
    
    if (!year || !make || !model) {
      return new Response(
        JSON.stringify({ error: 'Year, make, and model are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Fetching trims for ${year} ${make} ${model}`);
    
    const makeEncoded = encodeURIComponent(make);
    const modelEncoded = encodeURIComponent(model);
    
    // Get vehicle details from NHTSA API with model variations
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${makeEncoded}/modelyear/${year}?format=json`
    );

    if (!response.ok) {
      console.log('NHTSA API error, returning empty trims');
      return new Response(
        JSON.stringify({ trims: [], source: 'nhtsa' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Extract all model variations that contain the base model name
    const modelLower = model.toLowerCase();
    const allVariations = data.Results
      .filter((item: any) => {
        const modelName = (item.Model_Name || '').toLowerCase();
        // Match variations of the model (e.g., "Camry LE", "Camry XLE" for "Camry")
        return modelName.includes(modelLower);
      })
      .map((item: any) => item.Model_Name || '');
    
    console.log(`Found ${allVariations.length} model variations from NHTSA`);
    
    // Extract trim names by removing the base model name
    const trims = allVariations
      .map((variation: string) => {
        // Remove the base model name to get the trim
        const trimPart = variation
          .replace(new RegExp(`^${model}\\s*`, 'i'), '')
          .trim();
        return trimPart;
      })
      .filter((trim: string) => {
        // Keep non-empty trims that don't match the full model name
        return trim && trim.length > 0 && trim.toLowerCase() !== modelLower;
      });

    const uniqueTrims = [...new Set(trims)].sort();
    
    console.log(`Extracted ${uniqueTrims.length} unique trims from NHTSA`);

    return new Response(
      JSON.stringify({ 
        trims: uniqueTrims,
        source: 'nhtsa'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching trims:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
