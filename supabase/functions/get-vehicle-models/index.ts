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
    const { year, make } = await req.json();
    
    if (!year || !make) {
      return new Response(
        JSON.stringify({ error: "Year and make are required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    console.log(`Fetching models for ${year} ${make}`);

    const makeEncoded = encodeURIComponent(make);
    const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${makeEncoded}/modelyear/${year}?format=json`;
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      console.log(`No models found for ${year} ${make}`);
      return new Response(
        JSON.stringify({ models: [] }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const models = data.Results
      .map((item: any) => item.Model_Name)
      .filter((model: string) => model && model.trim() !== "")
      .sort();

    const uniqueModels = [...new Set(models)];

    console.log(`Found ${uniqueModels.length} models for ${make}`);

    return new Response(
      JSON.stringify({ models: uniqueModels }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error fetching models:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});