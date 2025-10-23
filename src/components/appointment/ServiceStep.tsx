import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { CircleDot, Disc, Droplet, Battery, Wind, Wrench, Car, Gauge } from "lucide-react";
import { AppointmentData } from "../AppointmentDialog";

interface ServiceStepProps {
  data: AppointmentData;
  onUpdate: (data: Partial<AppointmentData>) => void;
}

const services = [
  {
    id: "tire-installation",
    name: "Tire Installation",
    description: "New tire sales and professional installation",
    icon: CircleDot,
  },
  {
    id: "tire-rotation",
    name: "Tire Rotation",
    description: "Extend tire life with regular rotation",
    icon: CircleDot,
  },
  {
    id: "wheel-alignment",
    name: "Wheel Alignment",
    description: "Precise alignment for better handling",
    icon: Gauge,
  },
  {
    id: "brake-service",
    name: "Brake Service",
    description: "Brake inspection, pad and rotor service",
    icon: Disc,
  },
  {
    id: "oil-change",
    name: "Oil Change",
    description: "Conventional or synthetic oil change",
    icon: Droplet,
  },
  {
    id: "battery-service",
    name: "Battery Service",
    description: "Battery testing and replacement",
    icon: Battery,
  },
  {
    id: "ac-service",
    name: "AC Service",
    description: "Air conditioning repair and recharge",
    icon: Wind,
  },
  {
    id: "inspection",
    name: "Vehicle Inspection",
    description: "Comprehensive vehicle inspection",
    icon: Car,
  },
  {
    id: "general-repair",
    name: "General Repair",
    description: "Other automotive repairs",
    icon: Wrench,
  },
];

const ServiceStep = ({ data, onUpdate }: ServiceStepProps) => {
  const handleServiceToggle = (serviceId: string) => {
    const currentServices = data.services || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter((id) => id !== serviceId)
      : [...currentServices, serviceId];
    
    onUpdate({ services: newServices });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">Select Services</h3>
        <p className="text-sm text-muted-foreground">
          Choose one or more services you need for your vehicle
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all ${
              data.services.includes(service.id)
                ? "border-primary border-2"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleServiceToggle(service.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={data.services.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded">
                      <service.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceStep;
