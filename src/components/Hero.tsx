import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-tires.jpg";
import AppointmentDialog from "./AppointmentDialog";

const Hero = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  return (
    <>
    <section className="relative min-h-[600px] flex items-center bg-foreground text-background overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-foreground/60" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-background/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Find Your Location</h2>
            <p className="text-foreground/80 mb-6">
              Enter your location below to find the nearest Wheels & Deals service center.
            </p>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Address, City or Zip" 
                  className="pl-10 h-12 bg-background"
                />
              </div>
              <Button size="lg" variant="secondary" className="h-12 px-6">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              View All Locations
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-secondary mb-2 tracking-wider">FIND THE RIGHT TIRES</h3>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Expert Installation For Less
              </h2>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Tire Installation Includes:</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Mounting and balancing",
                  "TPMS inspection/reset",
                  "Alignment check",
                  "Precision wheel torque",
                  "Lifetime rotations",
                  "Lifetime rebalance"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button size="lg" className="text-base px-8" onClick={() => setAppointmentOpen(true)}>
              Schedule An Appointment
            </Button>
          </div>
        </div>
      </div>
    </section>

    <AppointmentDialog open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </>
  );
};

export default Hero;
