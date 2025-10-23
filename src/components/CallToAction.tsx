import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock } from "lucide-react";
import AppointmentDialog from "./AppointmentDialog";

const CallToAction = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  return (
    <>
    <section id="contact" className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-background/80">
              Schedule your appointment today and experience the Wheels & Deals difference. Quality service, competitive pricing, and expert care for your vehicle.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 h-auto" onClick={() => setAppointmentOpen(true)}>
              Schedule An Appointment
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Call Us</h3>
                <p className="text-background/80">(555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                <p className="text-background/80">Multiple locations to serve you better</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                <p className="text-background/80">Mon-Fri: 7am - 7pm</p>
                <p className="text-background/80">Sat: 8am - 5pm, Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppointmentDialog open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </>
  );
};

export default CallToAction;
