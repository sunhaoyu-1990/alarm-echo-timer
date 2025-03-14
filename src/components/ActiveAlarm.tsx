
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlarmClock, Bell, BellOff, Check, X } from 'lucide-react';
import TimeDisplay from './TimeDisplay';
import { useAlarm } from '@/contexts/AlarmContext';
import { cn } from '@/lib/utils';

const ActiveAlarm: React.FC = () => {
  const { activeAlarm, continueAlarm, stopAlarm, isRinging } = useAlarm();
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (!activeAlarm || isRinging || !activeAlarm.nextRingTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const nextRing = new Date(activeAlarm.nextRingTime as Date);
      const diff = Math.max(0, (nextRing.getTime() - now.getTime()) / 1000);
      
      setTimeLeft(Math.floor(diff));
      
      // Calculate progress as percentage of time left
      const totalInterval = activeAlarm.intervalDuration;
      const progressValue = (diff / totalInterval) * 100;
      setProgress(Math.min(100, Math.max(0, progressValue)));
      
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeAlarm, isRinging]);
  
  if (!activeAlarm) return null;
  
  return (
    <Card className={cn(
      "w-full max-w-md mx-auto transition-all duration-500 shadow-medium",
      isRinging ? "animate-pulse-ring ring-4 ring-primary/50" : ""
    )}>
      <CardHeader className={cn(
        "transition-colors",
        isRinging ? "bg-primary text-primary-foreground" : ""
      )}>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <AlarmClock className="h-6 w-6 mr-2" />
            {isRinging ? "闹钟响铃中" : "活动闹钟"}
          </span>
          <span className="text-sm font-normal">
            {activeAlarm.currentRepetition}/{activeAlarm.repetitions}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        {isRinging ? (
          <div className="text-center space-y-4">
            <Bell className="h-16 w-16 mx-auto text-primary animate-pulse" />
            <h2 className="text-2xl font-medium">闹钟响了!</h2>
            <p className="text-muted-foreground">
              这是第 {activeAlarm.currentRepetition} 次响铃，共 {activeAlarm.repetitions} 次
            </p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">距离下次响铃</p>
              <TimeDisplay seconds={timeLeft} className="text-3xl" />
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">间隔时长</p>
                <p className="font-medium">
                  {Math.floor(activeAlarm.intervalDuration / 60)}分 {activeAlarm.intervalDuration % 60}秒
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">剩余次数</p>
                <p className="font-medium">
                  {activeAlarm.repetitions - activeAlarm.currentRepetition}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className={cn(
        "grid gap-4",
        isRinging ? "grid-cols-2" : "grid-cols-1"
      )}>
        {isRinging ? (
          <>
            <Button
              onClick={continueAlarm}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 btn-scale"
            >
              <Check className="h-5 w-5 mr-2" />
              继续
            </Button>
            <Button
              onClick={stopAlarm}
              variant="destructive"
              className="btn-scale"
            >
              <X className="h-5 w-5 mr-2" />
              终止
            </Button>
          </>
        ) : (
          <Button
            onClick={stopAlarm}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 btn-scale"
          >
            <BellOff className="h-5 w-5 mr-2" />
            取消闹钟
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ActiveAlarm;
