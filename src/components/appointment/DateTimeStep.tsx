import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AppointmentData } from "../AppointmentDialog";

interface DateTimeStepProps {
  data: AppointmentData;
  onUpdate: (data: Partial<AppointmentData>) => void;
}

const timeSlots = [
  "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"
];

const DateTimeStep = ({ data, onUpdate }: DateTimeStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.dateTime?.date
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    data.dateTime?.time
  );

  useEffect(() => {
    if (selectedDate && selectedTime) {
      onUpdate({ dateTime: { date: selectedDate, time: selectedTime } });
    }
  }, [selectedDate, selectedTime, onUpdate]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">Select Date & Time</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred appointment date and time
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date.getDay() === 0}
            initialFocus
            className={cn("rounded-md border pointer-events-auto")}
          />
          <p className="text-xs text-muted-foreground mt-2">
            * Sundays are closed
          </p>
        </div>

        <div className="space-y-2">
          <Label>Select Time</Label>
          <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTime(time)}
                disabled={!selectedDate}
                className="w-full"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="font-semibold">Selected Appointment:</p>
          <p className="text-lg">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default DateTimeStep;
