import { Card, CardContent } from "@/components/ui/card";
import { Wrench, CircleDot, Disc, Droplet, Battery, Wind } from "lucide-react";

const services = [
  {
    icon: CircleDot,
    title: "Tire Sales & Installation",
    description: "Premium tire brands with expert installation and lifetime support"
  },
  {
    icon: Disc,
    title: "Brake Services",
    description: "Complete brake inspection, pad replacement, and rotor services"
  },
  {
    icon: Droplet,
    title: "Oil Changes",
    description: "Quick oil changes with quality synthetic and conventional oils"
  },
  {
    icon: Battery,
    title: "Battery Service",
    description: "Battery testing, replacement, and electrical system diagnostics"
  },
  {
    icon: Wind,
    title: "AC Service",
    description: "Air conditioning repair, recharge, and maintenance services"
  },
  {
    icon: Wrench,
    title: "General Repairs",
    description: "Comprehensive automotive repair services for all makes and models"
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner for all automotive needs. Quality service, expert technicians, and competitive prices.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
