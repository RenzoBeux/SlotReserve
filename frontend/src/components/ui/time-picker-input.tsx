
import * as React from "react";
import { Input } from "@/components/ui/input";

interface TimePickerInputProps {
  value?: string;
  onChange?: (time: string) => void;
  disabled?: boolean;
}

export function TimePickerInput({ value = "12:00", onChange, disabled }: TimePickerInputProps) {
  const [hours, setHours] = React.useState<string>(value.split(':')[0]);
  const [minutes, setMinutes] = React.useState<string>(value.split(':')[1]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = e.target.value;
    if (!/^\d*$/.test(newHours)) return;
    
    let numericHours = parseInt(newHours, 10);
    if (numericHours > 23) numericHours = 23;
    
    const formattedHours = numericHours ? 
      numericHours.toString().padStart(2, '0') : 
      '';
    
    setHours(formattedHours);
    
    if (onChange) {
      onChange(`${formattedHours || '00'}:${minutes}`);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = e.target.value;
    if (!/^\d*$/.test(newMinutes)) return;
    
    let numericMinutes = parseInt(newMinutes, 10);
    if (numericMinutes > 59) numericMinutes = 59;
    
    const formattedMinutes = numericMinutes ? 
      numericMinutes.toString().padStart(2, '0') : 
      '';
    
    setMinutes(formattedMinutes);
    
    if (onChange) {
      onChange(`${hours || '00'}:${formattedMinutes || '00'}`);
    }
  };

  React.useEffect(() => {
    if (value) {
      const [newHours, newMinutes] = value.split(':');
      setHours(newHours);
      setMinutes(newMinutes);
    }
  }, [value]);

  return (
    <div className="flex items-center gap-2">
      <Input
        className="w-16 text-center"
        value={hours}
        onChange={handleHoursChange}
        placeholder="HH"
        disabled={disabled}
        maxLength={2}
      />
      <span className="text-lg">:</span>
      <Input
        className="w-16 text-center"
        value={minutes}
        onChange={handleMinutesChange}
        placeholder="MM"
        disabled={disabled}
        maxLength={2}
      />
    </div>
  );
}
