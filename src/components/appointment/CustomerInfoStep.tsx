import { useState, useEffect } from "react";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentData } from "../AppointmentDialog";

interface CustomerInfoStepProps {
  data: AppointmentData;
  onUpdate: (data: Partial<AppointmentData>) => void;
}

const customerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  notes: z.string().max(500).optional(),
});

const CustomerInfoStep = ({ data, onUpdate }: CustomerInfoStepProps) => {
  const [name, setName] = useState(data.customer?.name || "");
  const [email, setEmail] = useState(data.customer?.email || "");
  const [phone, setPhone] = useState(data.customer?.phone || "");
  const [notes, setNotes] = useState(data.customer?.notes || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      customerSchema.parse({ name, email, phone, notes });
      setErrors({});
      onUpdate({ customer: { name, email, phone, notes } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  }, [name, email, phone, notes, onUpdate]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">Your Information</h3>
        <p className="text-sm text-muted-foreground">
          We'll use this information to confirm your appointment
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any specific concerns or requests..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            {notes.length}/500 characters
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoStep;
