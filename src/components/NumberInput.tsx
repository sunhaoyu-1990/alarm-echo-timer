
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  inputClassName?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className,
  inputClassName,
}) => {
  const [internalValue, setInternalValue] = useState<string>(value.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      const clampedValue = Math.min(Math.max(numericValue, min), max);
      onChange(clampedValue);
    }
  };

  const increment = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
    setInternalValue(newValue.toString());
  };

  const decrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
    setInternalValue(newValue.toString());
  };

  const handleBlur = () => {
    // When input loses focus, ensure displayed value is valid
    const numericValue = parseFloat(internalValue);
    if (isNaN(numericValue)) {
      setInternalValue(value.toString());
    } else {
      const clampedValue = Math.min(Math.max(numericValue, min), max);
      setInternalValue(clampedValue.toString());
      onChange(clampedValue);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <div className="text-sm font-medium">{label}</div>}
      <div className="flex items-center">
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          className="rounded-r-none h-10 w-10"
          onClick={decrement}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className={cn("rounded-none text-center h-10", inputClassName)}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          className="rounded-l-none h-10 w-10"
          onClick={increment}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NumberInput;
