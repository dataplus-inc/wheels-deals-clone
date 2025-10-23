import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LocationStep from "./appointment/LocationStep";
import ServiceStep from "./appointment/ServiceStep";
import VehicleStep from "./appointment/VehicleStep";
import DateTimeStep from "./appointment/DateTimeStep";
import CustomerInfoStep from "./appointment/CustomerInfoStep";
import ConfirmationStep from "./appointment/ConfirmationStep";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface AppointmentData {
  location?: {
    name: string;
    address: string;
    phone: string;
  };
  services: string[];
  vehicle?: {
    year: string;
    make: string;
    model: string;
  };
  dateTime?: {
    date: Date;
    time: string;
  };
  customer?: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
}

const AppointmentDialog = ({ open, onOpenChange }: AppointmentDialogProps) => {
  const [step, setStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    services: [],
  });

  const totalSteps = 6;

  const stepTitles = [
    "Select Location",
    "Choose Services",
    "Vehicle Information",
    "Date & Time",
    "Your Information",
    "Confirmation",
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Handle appointment submission
    console.log("Appointment Data:", appointmentData);
    onOpenChange(false);
    setStep(1);
    setAppointmentData({ services: [] });
  };

  const updateAppointmentData = (data: Partial<AppointmentData>) => {
    setAppointmentData((prev) => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!appointmentData.location;
      case 2:
        return appointmentData.services.length > 0;
      case 3:
        return !!appointmentData.vehicle;
      case 4:
        return !!appointmentData.dateTime;
      case 5:
        return !!appointmentData.customer;
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Schedule an Appointment</DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}: {stepTitles[step - 1]}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step === 1 && (
            <LocationStep
              data={appointmentData}
              onUpdate={updateAppointmentData}
            />
          )}
          {step === 2 && (
            <ServiceStep
              data={appointmentData}
              onUpdate={updateAppointmentData}
            />
          )}
          {step === 3 && (
            <VehicleStep
              data={appointmentData}
              onUpdate={updateAppointmentData}
            />
          )}
          {step === 4 && (
            <DateTimeStep
              data={appointmentData}
              onUpdate={updateAppointmentData}
            />
          )}
          {step === 5 && (
            <CustomerInfoStep
              data={appointmentData}
              onUpdate={updateAppointmentData}
            />
          )}
          {step === 6 && (
            <ConfirmationStep
              data={appointmentData}
              onComplete={handleComplete}
            />
          )}
        </div>

        {step < 6 && (
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
