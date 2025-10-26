import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { year, make, model } = await req.json();
    
    if (!year || !make || !model) {
      return new Response(
        JSON.stringify({ error: "Year, make, and model are required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    console.log(`Fetching trims for ${year} ${make} ${model}`);
    
    const makeEncoded = encodeURIComponent(make);
    const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${makeEncoded}/modelyear/${year}?format=json`;
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.log("NHTSA API error, returning empty trims");
      return new Response(
        JSON.stringify({ trims: [], source: "nhtsa" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      return new Response(
        JSON.stringify({ trims: [], source: "nhtsa" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const modelLower = model.toLowerCase();
    
    const allVariations = data.Results
      .filter((item: any) => {
        const modelName = (item.Model_Name || "").toLowerCase();
        return modelName.startsWith(modelLower + " ") || modelName === modelLower;
      })
      .map((item: any) => item.Model_Name || "");
    
    console.log(`Found ${allVariations.length} model variations from NHTSA`);
    
    const trims = allVariations
      .map((variation: string) => {
        const trimPart = variation
          .substring(model.length)
          .trim();
        return trimPart;
      })
      .filter((trim: string) => {
        return trim && trim.length > 0 && trim.toLowerCase() !== modelLower;
      });

    const uniqueTrims = [...new Set(trims)].sort();
    
    console.log(`Extracted ${uniqueTrims.length} unique trims from NHTSA`);

    return new Response(
      JSON.stringify({ 
        trims: uniqueTrims,
        source: "nhtsa"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error fetching trims:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage, trims: [] }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});