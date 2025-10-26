import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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
    const { year, make, model, trim } = await req.json();
    
    if (!year || !make || !model) {
      return new Response(
        JSON.stringify({ error: "Year, make, and model are required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    console.log(`Fetching tire sizes for ${year} ${make} ${model}${trim ? ` ${trim}` : ""}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const cacheKey = {
      year,
      make,
      model,
      trim: trim || ""
    };

    const { data: cachedData, error: cacheError } = await supabase
      .from("vehicle_specs_cache")
      .select("tire_sizes, vehicle_type, source")
      .eq("year", cacheKey.year)
      .eq("make", cacheKey.make)
      .eq("model", cacheKey.model)
      .eq("trim", cacheKey.trim)
      .maybeSingle();

    if (!cacheError && cachedData && cachedData.tire_sizes && cachedData.tire_sizes.length > 0) {
      console.log("Returning cached tire sizes");
      return new Response(
        JSON.stringify({ 
          tire_sizes: cachedData.tire_sizes,
          source: "cached",
          vehicle_type: cachedData.vehicle_type
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const makeEncoded = encodeURIComponent(make);
    let tireSizes: string[] = [];
    let vehicleType = "sedan";
    let dataSource = "estimated";

    try {
      const modelsResponse = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${makeEncoded}/modelyear/${year}?format=json`
      );

      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        const modelLower = model.toLowerCase();
        
        let matchingModel = modelsData.Results?.find((item: any) => {
          const itemModel = (item.Model_Name || "").toLowerCase();
          if (trim) {
            return itemModel === `${modelLower} ${trim.toLowerCase()}` || itemModel.startsWith(`${modelLower} `);
          }
          return itemModel === modelLower || itemModel.startsWith(`${modelLower} `);
        });

        if (matchingModel?.Model_ID) {
          console.log(`Found Model_ID: ${matchingModel.Model_ID}`);
        }
      }
    } catch (apiError) {
      console.log("NHTSA API error:", apiError);
    }

    const modelLower = model.toLowerCase();
    
    if (modelLower.includes("suv") || modelLower.includes("explorer") || 
        modelLower.includes("pilot") || modelLower.includes("highlander") ||
        modelLower.includes("rav") || modelLower.includes("cr-v") || 
        modelLower.includes("escape") || modelLower.includes("rogue") ||
        modelLower.includes("pathfinder") || modelLower.includes("4runner") ||
        modelLower.includes("traverse") || modelLower.includes("tahoe")) {
      vehicleType = "suv";
    } else if (modelLower.includes("truck") || modelLower.includes("f-150") || 
               modelLower.includes("f-250") || modelLower.includes("f-350") ||
               modelLower.includes("silverado") || modelLower.includes("ram") ||
               modelLower.includes("tundra") || modelLower.includes("titan")) {
      vehicleType = "truck";
    } else if (modelLower.includes("sport") || modelLower.includes("corvette") || 
               modelLower.includes("mustang") || modelLower.includes("camaro") ||
               modelLower.includes("challenger") || modelLower.includes("911")) {
      vehicleType = "sports";
    } else if (modelLower.includes("fit") || modelLower.includes("civic") || 
               modelLower.includes("corolla") || modelLower.includes("cruze") ||
               modelLower.includes("sentra") || modelLower.includes("elantra")) {
      vehicleType = "compact";
    }

    const { data: tireSizeData } = await supabase
      .from("tire_sizes")
      .select("size_code")
      .contains("vehicle_types", [vehicleType])
      .order("size_code");

    if (tireSizeData && tireSizeData.length > 0) {
      tireSizes = tireSizeData.map(item => item.size_code);
      console.log(`Found ${tireSizes.length} tire sizes from database for vehicle type: ${vehicleType}`);
    } else {
      const fallbackSizes: { [key: string]: string[] } = {
        sedan: ["205/55R16", "215/55R17", "225/50R17", "235/45R18"],
        suv: ["225/65R17", "235/60R18", "245/60R18", "255/55R18"],
        truck: ["245/70R17", "265/70R17", "275/65R18", "265/60R18"],
        sports: ["225/45R17", "235/40R18", "245/40R19", "255/35R19"],
        compact: ["185/65R15", "195/65R15", "205/55R16", "215/55R16"],
      };
      tireSizes = fallbackSizes[vehicleType] || fallbackSizes.sedan;
      console.log(`Using fallback tire sizes for ${vehicleType}`);
    }

    await supabase
      .from("vehicle_specs_cache")
      .upsert({
        year: cacheKey.year,
        make: cacheKey.make,
        model: cacheKey.model,
        trim: cacheKey.trim,
        tire_sizes: tireSizes,
        vehicle_type: vehicleType,
        source: dataSource,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "year,make,model,trim"
      });

    console.log(`Returning ${tireSizes.length} tire sizes for ${vehicleType} type vehicle`);

    return new Response(
      JSON.stringify({ 
        tire_sizes: tireSizes,
        source: dataSource,
        vehicle_type: vehicleType,
        note: "These are common tire sizes for this vehicle type. Contact us for exact specifications."
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error fetching tire sizes:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(
      JSON.stringify({ 
        tire_sizes: ["215/60R16", "225/55R17", "235/55R18"],
        source: "fallback",
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 200 
      }
    );
  }
});