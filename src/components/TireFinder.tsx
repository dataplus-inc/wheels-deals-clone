import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());


const TireFinder = () => {
  const { toast } = useToast();
  const [searchType, setSearchType] = useState("vehicle");
  
  // Vehicle search state
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableTrims, setAvailableTrims] = useState<string[]>([]);
  const [suggestedSizes, setSuggestedSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingTrims, setLoadingTrims] = useState(false);
  const [loadingSizes, setLoadingSizes] = useState(false);
  
  // Direct size search state
  const [directSize, setDirectSize] = useState("");
  
  // Quotation state
  const [showQuotation, setShowQuotation] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch makes when year changes
  useEffect(() => {
    const fetchMakes = async () => {
      if (year) {
        setLoadingMakes(true);
        setMake("");
        setModel("");
        setTrim("");
        setAvailableModels([]);
        setAvailableTrims([]);
        setSuggestedSizes([]);
        
        try {
          const { data, error } = await supabase.functions.invoke('get-vehicle-makes', {
            body: { year }
          });

          if (error) throw error;
          setAvailableMakes(data.makes || []);
        } catch (error) {
          console.error('Error fetching makes:', error);
          toast({
            title: "Error",
            description: "Could not load vehicle makes. Please try again.",
            variant: "destructive"
          });
        } finally {
          setLoadingMakes(false);
        }
      }
    };

    fetchMakes();
  }, [year, toast]);

  // Fetch models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      if (year && make) {
        setLoadingModels(true);
        setModel("");
        setTrim("");
        setAvailableTrims([]);
        setSuggestedSizes([]);
        
        try {
          const { data, error } = await supabase.functions.invoke('get-vehicle-models', {
            body: { year, make }
          });

          if (error) throw error;
          setAvailableModels(data.models || []);
        } catch (error) {
          console.error('Error fetching models:', error);
          toast({
            title: "Error",
            description: "Could not load vehicle models. Please try again.",
            variant: "destructive"
          });
        } finally {
          setLoadingModels(false);
        }
      }
    };

    fetchModels();
  }, [year, make, toast]);

  // Fetch trims when model changes
  useEffect(() => {
    const fetchTrims = async () => {
      if (year && make && model) {
        setLoadingTrims(true);
        setTrim("");
        setSuggestedSizes([]);
        
        try {
          const { data, error } = await supabase.functions.invoke('get-vehicle-trims', {
            body: { year, make, model }
          });

          if (error) throw error;
          
          if (data.trims && data.trims.length > 0) {
            setAvailableTrims(data.trims);
          } else {
            // No trims available, fetch tire sizes without trim
            setAvailableTrims([]);
            setTrim(""); // Clear trim selection
          }
        } catch (error) {
          console.error('Error fetching trims:', error);
          setAvailableTrims([]);
        } finally {
          setLoadingTrims(false);
        }
      }
    };

    fetchTrims();
  }, [year, make, model, toast]);

  // Fetch tire sizes when trim changes or when model is selected without trims
  useEffect(() => {
    const fetchTireSizes = async () => {
      // Only fetch if we have year, make, model AND either:
      // 1. No trims are available (trim field will be empty)
      // 2. A trim has been selected
      const shouldFetch = year && make && model && (availableTrims.length === 0 || trim);
      
      if (shouldFetch) {
        setLoadingSizes(true);
        try {
          let query = supabase
            .from('vehicle_tire_sizes')
            .select('tire_sizes')
            .eq('year', year)
            .eq('make', make)
            .eq('model', model);

          // Add trim filter if trim is selected
          if (trim) {
            query = query.eq('trim', trim);
          }

          const { data, error } = await query;

          if (error) {
            console.error('Error fetching tire sizes:', error);
            // Fallback to default sizes
            const commonSizes = ['215/60R16', '225/55R17', '235/55R18', '225/65R17'];
            setSuggestedSizes(commonSizes);
            setSelectedSize(commonSizes[0]);
            toast({
              title: "Using Common Tire Sizes",
              description: "Exact data not available for this vehicle. Showing common sizes. Contact us for exact specifications.",
            });
          } else if (data && data.length > 0) {
            // Collect all unique tire sizes from all matching records
            const allSizes = data.reduce((acc: string[], row) => {
              if (row.tire_sizes) {
                return [...acc, ...row.tire_sizes];
              }
              return acc;
            }, []);
            
            const uniqueSizes = [...new Set(allSizes)].sort();
            
            if (uniqueSizes.length > 0) {
              setSuggestedSizes(uniqueSizes);
              setSelectedSize(uniqueSizes[0]);
            } else {
              // No sizes found even though records exist
              const commonSizes = ['215/60R16', '225/55R17', '235/55R18', '225/65R17'];
              setSuggestedSizes(commonSizes);
              setSelectedSize(commonSizes[0]);
              toast({
                title: "Using Common Tire Sizes",
                description: "Exact data not available for this vehicle. Showing common sizes. Contact us for exact specifications.",
              });
            }
          } else {
            // If trim was selected but no data found, try without trim as fallback
            if (trim) {
              const fallbackQuery = await supabase
                .from('vehicle_tire_sizes')
                .select('tire_sizes')
                .eq('year', year)
                .eq('make', make)
                .eq('model', model);
              
              if (fallbackQuery.data && fallbackQuery.data.length > 0) {
                const allSizes = fallbackQuery.data.reduce((acc: string[], row) => {
                  if (row.tire_sizes) {
                    return [...acc, ...row.tire_sizes];
                  }
                  return acc;
                }, []);
                
                const uniqueSizes = [...new Set(allSizes)].sort();
                setSuggestedSizes(uniqueSizes);
                setSelectedSize(uniqueSizes[0]);
                toast({
                  title: "Using General Tire Sizes",
                  description: "Exact data for this trim not available. Showing sizes for this model. Verify with us for your specific trim.",
                });
                return;
              }
            }
            
            // No data found at all - provide common sizes as fallback
            const commonSizes = ['215/60R16', '225/55R17', '235/55R18', '225/65R17'];
            setSuggestedSizes(commonSizes);
            setSelectedSize(commonSizes[0]);
            toast({
              title: "Using Common Tire Sizes",
              description: "Exact data not available for this vehicle. Showing common sizes. Contact us for exact specifications.",
            });
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          setSuggestedSizes(['215/60R16', '225/55R17']);
          setSelectedSize('215/60R16');
        } finally {
          setLoadingSizes(false);
        }
      }
    };

    fetchTireSizes();
  }, [year, make, model, trim, availableTrims, toast]);

  const handleFindTires = () => {
    if (searchType === "vehicle") {
      if (!year || !make || !model || !selectedSize) {
        toast({
          title: "Missing Information",
          description: "Please complete all vehicle selections and tire size.",
          variant: "destructive"
        });
        return;
      }
      // Check if trims are available but none selected
      if (availableTrims.length > 0 && !trim) {
        toast({
          title: "Missing Information",
          description: "Please select a trim/edition for your vehicle.",
          variant: "destructive"
        });
        return;
      }
      setShowQuotation(true);
    } else {
      if (!directSize) {
        toast({
          title: "Missing Information",
          description: "Please enter a tire size.",
          variant: "destructive"
        });
        return;
      }
      setShowQuotation(true);
    }
  };

  const handleSubmitQuotation = () => {
    if (!name || !email || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all contact fields.",
        variant: "destructive"
      });
      return;
    }

    const vehicleInfo = searchType === "vehicle" 
      ? `${year} ${make} ${model}${trim ? ` ${trim}` : ''} - Tire Size: ${selectedSize}`
      : `Tire Size: ${directSize}`;

    toast({
      title: "Quotation Request Submitted!",
      description: "We'll contact you shortly with pricing information.",
    });

    // Reset form
    setShowQuotation(false);
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
  };

  if (showQuotation) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Request a Quotation</h3>
          <p className="text-gray-700 font-medium">
            {searchType === "vehicle" 
              ? `${year} ${make} ${model}${trim ? ` ${trim}` : ''} - Tire Size: ${selectedSize}`
              : `Tire Size: ${directSize}`}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quote-name" className="text-gray-900 font-semibold">Name *</Label>
            <Input
              id="quote-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote-email" className="text-gray-900 font-semibold">Email *</Label>
            <Input
              id="quote-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote-phone" className="text-gray-900 font-semibold">Phone *</Label>
            <Input
              id="quote-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote-notes" className="text-gray-900 font-semibold">Additional Notes</Label>
            <Textarea
              id="quote-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or questions..."
              rows={3}
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleSubmitQuotation}
            className="flex-1 font-bold uppercase"
          >
            Submit Request
          </Button>
          <Button 
            onClick={() => setShowQuotation(false)}
            variant="outline"
            className="font-bold uppercase"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={searchType} onValueChange={setSearchType}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-200">
          <TabsTrigger value="vehicle" className="font-bold text-gray-900 data-[state=active]:bg-white">Shop Tires by Vehicle</TabsTrigger>
          <TabsTrigger value="size" className="font-bold text-gray-900 data-[state=active]:bg-white">Shop Tires by Size</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="year" className="text-gray-900 font-semibold">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="year" className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 z-50">
                {years.map((y) => (
                  <SelectItem key={y} value={y} className="text-gray-900">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="make" className="text-gray-900 font-semibold">Make</Label>
            <Select value={make} onValueChange={setMake} disabled={!year || loadingMakes}>
              <SelectTrigger id="make" className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder={loadingMakes ? "Loading makes..." : "Select make"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 z-50">
                {availableMakes.map((m) => (
                  <SelectItem key={m} value={m} className="text-gray-900">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-gray-900 font-semibold">Model</Label>
            <Select value={model} onValueChange={setModel} disabled={!make || loadingModels}>
              <SelectTrigger id="model" className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder={loadingModels ? "Loading models..." : "Select model"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 z-50">
                {availableModels.map((m) => (
                  <SelectItem key={m} value={m} className="text-gray-900">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loadingTrims && (
            <div className="flex items-center justify-center gap-2 p-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-gray-700 font-medium">Loading trims...</span>
            </div>
          )}

          {!loadingTrims && availableTrims.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="trim" className="text-gray-900 font-semibold">Trim / Edition</Label>
              <Select value={trim} onValueChange={setTrim}>
                <SelectTrigger id="trim" className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select trim" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  {availableTrims.map((t) => (
                    <SelectItem key={t} value={t} className="text-gray-900">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {loadingSizes && (
            <div className="flex items-center justify-center gap-2 p-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-gray-700 font-medium">Loading tire sizes...</span>
            </div>
          )}

          {!loadingSizes && suggestedSizes.length > 0 && (
            <div className="space-y-2 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <Label htmlFor="tire-size" className="text-gray-900 font-semibold">Suggested Tire Size</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger id="tire-size" className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select tire size" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  {suggestedSizes.map((size) => (
                    <SelectItem key={size} value={size} className="text-gray-900">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-blue-900 font-medium">
                {year === "2024" 
                  ? "✓ Exact tire sizes from manufacturer specifications" 
                  : "ℹ Common tire sizes - Contact us to verify exact specifications"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="size" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="direct-size" className="text-gray-900 font-semibold">Tire Size</Label>
            <Input
              id="direct-size"
              value={directSize}
              onChange={(e) => setDirectSize(e.target.value)}
              placeholder="e.g., 215/55R17"
              className="bg-white border-gray-300 text-gray-900"
            />
            <p className="text-sm text-gray-700">
              Enter your tire size (found on your tire sidewall)
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Button 
        onClick={handleFindTires}
        className="w-full font-bold uppercase text-lg"
        size="lg"
      >
        Find Tires
      </Button>
    </div>
  );
};

export default TireFinder;
