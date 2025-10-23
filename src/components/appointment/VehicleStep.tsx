import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentData } from "../AppointmentDialog";

interface VehicleStepProps {
  data: AppointmentData;
  onUpdate: (data: Partial<AppointmentData>) => void;
}

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

const VehicleStep = ({ data, onUpdate }: VehicleStepProps) => {
  const [year, setYear] = useState(data.vehicle?.year || "");
  const [make, setMake] = useState(data.vehicle?.make || "");
  const [model, setModel] = useState(data.vehicle?.model || "");
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    if (make) {
      setAvailableModels(modelsByMake[make] || modelsByMake["Default"]);
    }
  }, [make]);

  useEffect(() => {
    if (year && make && model) {
      onUpdate({ vehicle: { year, make, model } });
    }
  }, [year, make, model, onUpdate]);

  const handleMakeChange = (value: string) => {
    setMake(value);
    setModel(""); // Reset model when make changes
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">Vehicle Information</h3>
        <p className="text-sm text-muted-foreground">
          Tell us about your vehicle so we can prepare for your service
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger id="year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Select value={make} onValueChange={handleMakeChange}>
            <SelectTrigger id="make">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {makes.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={model} onValueChange={setModel} disabled={!make}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {year && make && model && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="font-semibold">Selected Vehicle:</p>
          <p className="text-lg">
            {year} {make} {model}
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleStep;
