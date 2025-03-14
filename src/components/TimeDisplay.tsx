
import React from 'react';
import { cn } from '@/lib/utils';

interface TimeDisplayProps {
  seconds: number;
  className?: string;
  showHours?: boolean;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ 
  seconds, 
  className,
  showHours = true
}) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const formatNumber = (num: number): string => num.toString().padStart(2, '0');
  
  return (
    <div className={cn("font-mono text-4xl tracking-tight", className)}>
      {showHours && (
        <>
          <span className="inline-block w-14 text-center">{formatNumber(hours)}</span>
          <span className="mx-1">:</span>
        </>
      )}
      <span className="inline-block w-14 text-center">{formatNumber(minutes)}</span>
      <span className="mx-1">:</span>
      <span className="inline-block w-14 text-center">{formatNumber(remainingSeconds)}</span>
    </div>
  );
};

export default TimeDisplay;
