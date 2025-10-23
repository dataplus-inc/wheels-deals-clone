import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import AppointmentDialog from "./AppointmentDialog";

const Header = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  return (
    <>
      <header className="bg-foreground text-background sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <Wrench className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold leading-tight">Wheels & Deals</h1>
                <span className="text-xs text-muted-foreground">Auto & Services</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#tires" className="hover:text-primary transition-colors font-medium">TIRES</a>
              <a href="#services" className="hover:text-primary transition-colors font-medium">AUTO SERVICES</a>
              <a href="#brakes" className="hover:text-primary transition-colors font-medium">BRAKES</a>
              <a href="#oil-change" className="hover:text-primary transition-colors font-medium">OIL CHANGE</a>
              <a href="#contact" className="hover:text-primary transition-colors font-medium">CONTACT</a>
            </nav>
            
            <Button size="lg" className="hidden md:inline-flex" onClick={() => setAppointmentOpen(true)}>
              Schedule Appointment
            </Button>
            
            <Button size="sm" className="md:hidden" onClick={() => setAppointmentOpen(true)}>
              Book Now
            </Button>
          </div>
        </div>
      </header>

      <AppointmentDialog open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </>
  );
};

export default Header;
