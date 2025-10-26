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
    const { year } = await req.json();
    
    if (!year) {
      return new Response(
        JSON.stringify({ error: "Year is required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    console.log(`Fetching makes for year: ${year}`);

    const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    const makes = data.Results
      .map((item: any) => item.MakeName)
      .filter((make: string) => make && make.trim() !== "")
      .sort();

    const uniqueMakes = [...new Set(makes)];

    console.log(`Found ${uniqueMakes.length} makes`);

    return new Response(
      JSON.stringify({ makes: uniqueMakes }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error fetching makes:", error);
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