import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Car, User, CheckCircle2 } from "lucide-react";
import { AppointmentData } from "../AppointmentDialog";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationStepProps {
  data: AppointmentData;
  onComplete: () => void;
}

const ConfirmationStep = ({ data, onComplete }: ConfirmationStepProps) => {
  const { toast } = useToast();

  const handleConfirm = () => {
    toast({
      title: "Appointment Scheduled!",
      description: "We've sent a confirmation email to your address.",
    });
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-bold text-2xl mb-2">Review Your Appointment</h3>
        <p className="text-muted-foreground">
          Please review your appointment details before confirming
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-sm text-muted-foreground">{data.location?.name}</p>
              <p className="text-sm text-muted-foreground">{data.location?.address}</p>
              <p className="text-sm text-muted-foreground">{data.location?.phone}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Date & Time</p>
              <p className="text-sm text-muted-foreground">
                {data.dateTime?.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground">{data.dateTime?.time}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Car className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Vehicle</p>
              <p className="text-sm text-muted-foreground">
                {data.vehicle?.year} {data.vehicle?.make} {data.vehicle?.model}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Services</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {data.services.map((service) => (
                  <li key={service}>• {service.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</li>
                ))}
              </ul>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Contact Information</p>
              <p className="text-sm text-muted-foreground">{data.customer?.name}</p>
              <p className="text-sm text-muted-foreground">{data.customer?.email}</p>
              <p className="text-sm text-muted-foreground">{data.customer?.phone}</p>
              {data.customer?.notes && (
                <>
                  <p className="text-sm font-medium mt-2">Notes:</p>
                  <p className="text-sm text-muted-foreground">{data.customer.notes}</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleConfirm} size="lg" className="w-full">
        Confirm Appointment
      </Button>
    </div>
  );
};

export default ConfirmationStep;
