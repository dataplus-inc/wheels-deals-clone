import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Search } from "lucide-react";
import { AppointmentData } from "../AppointmentDialog";

interface LocationStepProps {
  data: AppointmentData;
  onUpdate: (data: Partial<AppointmentData>) => void;
}

const mockLocations = [
  {
    id: 1,
    name: "Wheels & Deals - Downtown",
    address: "123 Main Street, City, ST 12345",
    phone: "(555) 123-4567",
    hours: {
      weekday: "Mon-Fri: 7:00 AM - 7:00 PM",
      saturday: "Sat: 8:00 AM - 5:00 PM",
      sunday: "Sun: Closed",
    },
  },
  {
    id: 2,
    name: "Wheels & Deals - Northside",
    address: "456 Oak Avenue, City, ST 12346",
    phone: "(555) 234-5678",
    hours: {
      weekday: "Mon-Fri: 7:00 AM - 7:00 PM",
      saturday: "Sat: 8:00 AM - 5:00 PM",
      sunday: "Sun: Closed",
    },
  },
  {
    id: 3,
    name: "Wheels & Deals - Westside",
    address: "789 Pine Road, City, ST 12347",
    phone: "(555) 345-6789",
    hours: {
      weekday: "Mon-Fri: 7:00 AM - 7:00 PM",
      saturday: "Sat: 8:00 AM - 5:00 PM",
      sunday: "Sun: Closed",
    },
  },
];

const LocationStep = ({ data, onUpdate }: LocationStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(data.location);

  const handleSelectLocation = (location: typeof mockLocations[0]) => {
    const locationData = {
      name: location.name,
      address: location.address,
      phone: location.phone,
    };
    setSelectedLocation(locationData);
    onUpdate({ location: locationData });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by address, city, or zip code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Available Locations</h3>
        {mockLocations.map((location) => (
          <Card
            key={location.id}
            className={`cursor-pointer transition-all ${
              selectedLocation?.name === location.name
                ? "border-primary border-2 shadow-md"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleSelectLocation(location)}
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg mb-1">{location.name}</h4>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{location.phone}</span>
                  </div>
                </div>
                <Button
                  variant={selectedLocation?.name === location.name ? "default" : "outline"}
                  size="sm"
                >
                  {selectedLocation?.name === location.name ? "Selected" : "Select"}
                </Button>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Clock className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="text-primary font-medium">{location.hours.weekday}</p>
                  <p className="text-muted-foreground">{location.hours.saturday}</p>
                  <p className="text-muted-foreground">{location.hours.sunday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LocationStep;
