import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

    // First, try to get trims from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: dbData, error: dbError } = await supabase
      .from('vehicle_tire_sizes')
      .select('trim, tire_sizes')
      .eq('year', year)
      .eq('make', make)
      .eq('model', model)
      .not('trim', 'is', null);

    if (!dbError && dbData && dbData.length > 0) {
      // Found trims in database
      const trimsWithSizes = dbData.map(item => ({
        trim: item.trim,
        tire_sizes: item.tire_sizes
      }));
      console.log(`Found ${trimsWithSizes.length} trims in database`);
      
      return new Response(
        JSON.stringify({ 
          trims: trimsWithSizes.map(t => t.trim).filter(Boolean).sort(),
          source: 'database'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no database trims, try NHTSA API to get vehicle variations
    console.log('No database trims found, trying NHTSA API');
    
    const makeEncoded = encodeURIComponent(make);
    const modelEncoded = encodeURIComponent(model);
    
    // Get vehicle details from NHTSA
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${makeEncoded}/modelyear/${year}?format=json`
    );

    if (!response.ok) {
      console.log('NHTSA API error, returning empty trims');
      return new Response(
        JSON.stringify({ trims: [], source: 'none' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Look for variations of the model that might indicate trims
    const modelVariations = data.Results
      .filter((item: any) => {
        const modelName = item.Model_Name?.toLowerCase() || '';
        const searchModel = model.toLowerCase();
        return modelName.includes(searchModel) && modelName !== searchModel;
      })
      .map((item: any) => {
        // Extract the trim part (everything after the base model name)
        const modelName = item.Model_Name || '';
        const trimPart = modelName.replace(new RegExp(model, 'i'), '').trim();
        return trimPart;
      })
      .filter((trim: string) => trim && trim.length > 0);

    const uniqueTrims = [...new Set(modelVariations)].sort();
    
    console.log(`Found ${uniqueTrims.length} potential trims from NHTSA`);

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
