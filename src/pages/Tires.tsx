import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TireFinder from "@/components/TireFinder";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AppointmentDialog from "@/components/AppointmentDialog";

const Tires = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  const installationIncludes = [
    "Mounting and balancing (includes standard valve stem)",
    "TPMS inspection/reset",
    "Precision wheel torque",
    "Alignment check",
    "Lifetime rotations",
    "Lifetime rebalance"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20">
        <div className="absolute inset-0 bg-[url('/tire-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Tire Finder Form */}
            <div className="bg-background/95 backdrop-blur p-8 rounded-lg shadow-2xl">
              <TireFinder />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold uppercase">
                  Make Tire Choice Your First Choice For Tires
                </h1>
                <p className="text-xl text-white/90">
                  We carry all major brand-name tires and guarantee your satisfaction.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Tire installation includes:</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {installationIncludes.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                size="lg" 
                variant="secondary"
                className="uppercase font-bold text-lg"
                onClick={() => setAppointmentOpen(true)}
              >
                Schedule an Appointment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gradient-to-r from-accent via-accent/90 to-accent/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold uppercase text-primary mb-4">
            The Right Tires Increase Your Safety, Comfort And Peace Of Mind
          </h2>
          <p className="text-lg text-primary/90 max-w-4xl mx-auto">
            No matter what you drive - sedan, sports car, mini-van, crossover/SUV or light truck - the tire professionals at Wheels & Deals will help recommend the perfect brand-name tire for your vehicle.
          </p>
        </div>
      </section>

      <Footer />
      
      <AppointmentDialog 
        open={appointmentOpen} 
        onOpenChange={setAppointmentOpen}
      />
    </div>
  );
};

export default Tires;
