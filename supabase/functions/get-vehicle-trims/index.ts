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

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch distinct trims from database
    const { data, error } = await supabase
      .from('vehicle_tire_sizes')
      .select('trim')
      .eq('year', year)
      .eq('make', make)
      .eq('model', model)
      .not('trim', 'is', null);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Extract unique trims
    const trims = [...new Set(data.map(item => item.trim))].filter(Boolean).sort();

    console.log(`Found ${trims.length} trims`);

    return new Response(
      JSON.stringify({ trims }),
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
