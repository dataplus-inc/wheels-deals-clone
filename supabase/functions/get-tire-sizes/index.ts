import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Common tire sizes by vehicle type as fallback
const COMMON_SIZES_BY_TYPE: { [key: string]: string[] } = {
  sedan: ['205/55R16', '215/55R17', '225/50R17', '235/45R18'],
  suv: ['225/65R17', '235/60R18', '245/60R18', '255/55R18'],
  truck: ['245/70R17', '265/70R17', '275/65R18', '265/60R18'],
  sports: ['225/45R17', '235/40R18', '245/40R19', '255/35R19'],
  compact: ['185/65R15', '195/60R15', '205/55R16', '215/55R16'],
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { year, make, model, trim } = await req.json();
    
    if (!year || !make || !model) {
      return new Response(
        JSON.stringify({ error: 'Year, make, and model are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Fetching tire sizes for ${year} ${make} ${model}${trim ? ` ${trim}` : ''}`);

    // Try NHTSA API for vehicle specifications
    const makeEncoded = encodeURIComponent(make);
    const modelEncoded = encodeURIComponent(model);
    
    try {
      // Get vehicle make/model ID first
      const modelsResponse = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${makeEncoded}/modelyear/${year}?format=json`
      );

      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        
        // Find matching model
        const modelLower = model.toLowerCase();
        const matchingModel = modelsData.Results?.find((item: any) => {
          const itemModel = (item.Model_Name || '').toLowerCase();
          if (trim) {
            // If trim specified, look for exact match with trim
            return itemModel === `${modelLower} ${trim.toLowerCase()}` || itemModel === modelLower;
          }
          return itemModel === modelLower;
        });

        if (matchingModel?.Model_ID) {
          console.log(`Found Model_ID: ${matchingModel.Model_ID}`);
          
          // Try to get vehicle specifications using the model ID
          const specsResponse = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleVariableValuesList/${matchingModel.Model_ID}?format=json`
          );

          if (specsResponse.ok) {
            const specsData = await specsResponse.json();
            console.log(`Got specs data for model ID ${matchingModel.Model_ID}`);
          }
        }
      }
    } catch (apiError) {
      console.log('NHTSA API error, will use fallback sizes:', apiError);
    }

    // Determine vehicle type from model name for better fallback
    const modelLower = model.toLowerCase();
    let vehicleType = 'sedan'; // default
    
    if (modelLower.includes('suv') || modelLower.includes('explorer') || 
        modelLower.includes('pilot') || modelLower.includes('highlander') ||
        modelLower.includes('rav') || modelLower.includes('cr-v') || 
        modelLower.includes('escape') || modelLower.includes('rogue')) {
      vehicleType = 'suv';
    } else if (modelLower.includes('truck') || modelLower.includes('f-150') || 
               modelLower.includes('silverado') || modelLower.includes('ram')) {
      vehicleType = 'truck';
    } else if (modelLower.includes('sport') || modelLower.includes('corvette') || 
               modelLower.includes('mustang') || modelLower.includes('camaro')) {
      vehicleType = 'sports';
    } else if (modelLower.includes('fit') || modelLower.includes('civic') || 
               modelLower.includes('corolla') || modelLower.includes('cruze')) {
      vehicleType = 'compact';
    }

    const commonSizes = COMMON_SIZES_BY_TYPE[vehicleType] || COMMON_SIZES_BY_TYPE.sedan;
    
    console.log(`Returning ${commonSizes.length} common sizes for ${vehicleType} type vehicle`);

    return new Response(
      JSON.stringify({ 
        tire_sizes: commonSizes,
        source: 'estimated',
        vehicle_type: vehicleType,
        note: 'These are common tire sizes for this vehicle type. Contact us for exact specifications.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching tire sizes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Return default fallback sizes even on error
    return new Response(
      JSON.stringify({ 
        tire_sizes: ['215/60R16', '225/55R17', '235/55R18'],
        source: 'fallback',
        error: errorMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
