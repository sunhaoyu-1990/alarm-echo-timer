
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Alarm {
  id: string;
  intervalDuration: number; // in seconds
  repetitions: number;
  startTime: Date;
  startFromNow: boolean;
  ringtone: string;
  isActive: boolean;
  currentRepetition: number;
  nextRingTime: Date | null;
}

interface AlarmContextType {
  alarms: Alarm[];
  activeAlarm: Alarm | null;
  createAlarm: (
    intervalDuration: number,
    repetitions: number,
    startTime: Date,
    startFromNow: boolean,
    ringtone: string
  ) => void;
  deleteAlarm: (id: string) => void;
  continueAlarm: () => void;
  stopAlarm: () => void;
  isRinging: boolean;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
};

interface AlarmProviderProps {
  children: ReactNode;
}

export const AlarmProvider: React.FC<AlarmProviderProps> = ({ children }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  const { toast } = useToast();
  
  // Audio element for playing ringtones
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    const audioElement = new Audio();
    audioElement.loop = true;
    setAudio(audioElement);
    
    // Clean up
    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, []);
  
  // Check for alarms that need to ring
  useEffect(() => {
    if (!activeAlarm || isRinging) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      
      if (activeAlarm.nextRingTime && now >= activeAlarm.nextRingTime) {
        // It's time to ring!
        setIsRinging(true);
        playRingtone(activeAlarm.ringtone);
        
        // Update active alarm
        setActiveAlarm(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            currentRepetition: prev.currentRepetition + 1,
            // Don't set nextRingTime yet - will be set if user continues
          };
        });
        
        toast({
          title: "闹钟响了!",
          description: `这是第 ${activeAlarm.currentRepetition + 1} 次响铃，共 ${activeAlarm.repetitions} 次。`,
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeAlarm, isRinging]);
  
  // Function to play the ringtone
  const playRingtone = (ringtone: string) => {
    if (!audio) return;
    
    audio.src = ringtone;
    audio.play().catch(err => {
      console.error('Failed to play ringtone:', err);
    });
  };
  
  // Function to stop the ringtone
  const stopRingtone = () => {
    if (!audio) return;
    
    audio.pause();
    audio.currentTime = 0;
  };
  
  // Create a new alarm
  const createAlarm = (
    intervalDuration: number,
    repetitions: number,
    startTime: Date,
    startFromNow: boolean,
    ringtone: string
  ) => {
    const id = Date.now().toString();
    const now = new Date();
    
    // Calculate nextRingTime
    let nextRingTime: Date;
    if (startFromNow) {
      nextRingTime = new Date(now.getTime());
    } else {
      nextRingTime = new Date(startTime.getTime());
    }
    
    const newAlarm: Alarm = {
      id,
      intervalDuration,
      repetitions,
      startTime,
      startFromNow,
      ringtone,
      isActive: true,
      currentRepetition: 0,
      nextRingTime,
    };
    
    setAlarms(prev => [...prev, newAlarm]);
    setActiveAlarm(newAlarm);
    
    toast({
      title: "闹钟已设置",
      description: `将在 ${formatDateTime(nextRingTime)} 响起`,
    });
  };
  
  // Delete an alarm
  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    
    if (activeAlarm?.id === id) {
      setActiveAlarm(null);
      setIsRinging(false);
      stopRingtone();
    }
    
    toast({
      title: "闹钟已删除",
    });
  };
  
  // Continue the alarm after it rings
  const continueAlarm = () => {
    if (!activeAlarm) return;
    
    // Stop current ringing
    stopRingtone();
    setIsRinging(false);
    
    // Check if we've reached the total repetitions
    if (activeAlarm.currentRepetition >= activeAlarm.repetitions) {
      toast({
        title: "闹钟完成",
        description: "所有重复次数已完成。",
      });
      
      setActiveAlarm(null);
      return;
    }
    
    // Set the next ring time
    const nextRingTime = new Date(Date.now() + activeAlarm.intervalDuration * 1000);
    
    setActiveAlarm(prev => {
      if (!prev) return null;
      
      const updated = {
        ...prev,
        nextRingTime,
      };
      
      return updated;
    });
    
    toast({
      title: "闹钟继续",
      description: `下次将在 ${formatDateTime(nextRingTime)} 响起`,
    });
  };
  
  // Stop the alarm completely
  const stopAlarm = () => {
    stopRingtone();
    setIsRinging(false);
    setActiveAlarm(null);
    
    toast({
      title: "闹钟已停止",
    });
  };
  
  // Helper function to format date/time
  const formatDateTime = (date: Date): string => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  return (
    <AlarmContext.Provider
      value={{
        alarms,
        activeAlarm,
        createAlarm,
        deleteAlarm,
        continueAlarm,
        stopAlarm,
        isRinging,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};
