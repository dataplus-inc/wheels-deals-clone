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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

const makes = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
  "Dodge", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", "Kia",
  "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Nissan", "Ram", "Subaru",
  "Tesla", "Toyota", "Volkswagen", "Volvo"
];

const modelsByMake: Record<string, string[]> = {
  "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "4Runner", "Prius"],
  "Honda": ["Accord", "Civic", "CR-V", "Pilot", "Odyssey", "Ridgeline"],
  "Ford": ["F-150", "Mustang", "Explorer", "Escape", "Edge", "Bronco"],
  "Chevrolet": ["Silverado", "Equinox", "Traverse", "Malibu", "Tahoe", "Suburban"],
  "Default": ["Model 1", "Model 2", "Model 3"]
};

// Tire size database by vehicle
const tireSizesByVehicle: Record<string, string[]> = {
  "2024-Toyota-Camry": ["215/55R17", "235/45R18"],
  "2024-Toyota-Corolla": ["205/55R16", "225/40R18"],
  "2024-Honda-Civic": ["215/55R16", "235/40R18"],
  "2024-Honda-Accord": ["225/50R17", "235/40R19"],
  "2024-Ford-F-150": ["265/70R17", "275/55R20"],
  "2024-Ford-Mustang": ["235/55R17", "255/40R19"],
  "Default": ["215/60R16", "225/55R17", "235/50R18"]
};

const TireFinder = () => {
  const { toast } = useToast();
  const [searchType, setSearchType] = useState("vehicle");
  
  // Vehicle search state
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [suggestedSizes, setSuggestedSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  
  // Direct size search state
  const [directSize, setDirectSize] = useState("");
  
  // Quotation state
  const [showQuotation, setShowQuotation] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (make) {
      setAvailableModels(modelsByMake[make] || modelsByMake["Default"]);
      setModel("");
      setSuggestedSizes([]);
      setSelectedSize("");
    }
  }, [make]);

  useEffect(() => {
    if (year && make && model) {
      const vehicleKey = `${year}-${make}-${model}`;
      const sizes = tireSizesByVehicle[vehicleKey] || tireSizesByVehicle["Default"];
      setSuggestedSizes(sizes);
      setSelectedSize(sizes[0]);
    }
  }, [year, make, model]);

  const handleFindTires = () => {
    if (searchType === "vehicle") {
      if (!year || !make || !model || !selectedSize) {
        toast({
          title: "Missing Information",
          description: "Please select your vehicle and tire size.",
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
      ? `${year} ${make} ${model} - Tire Size: ${selectedSize}`
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
              ? `${year} ${make} ${model} - Tire Size: ${selectedSize}`
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
            <Select value={make} onValueChange={setMake} disabled={!year}>
              <SelectTrigger id="make" className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 z-50">
                {makes.map((m) => (
                  <SelectItem key={m} value={m} className="text-gray-900">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-gray-900 font-semibold">Model</Label>
            <Select value={model} onValueChange={setModel} disabled={!make}>
              <SelectTrigger id="model" className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select model" />
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

          {suggestedSizes.length > 0 && (
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
                ✓ These tire sizes are compatible with your vehicle
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
