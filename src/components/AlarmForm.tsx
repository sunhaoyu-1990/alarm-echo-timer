
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Clock, AlarmClock, Bell } from 'lucide-react';
import NumberInput from './NumberInput';
import TimeDisplay from './TimeDisplay';
import RingtoneSelector from './RingtoneSelector';
import { useAlarm } from '@/contexts/AlarmContext';

const AlarmForm: React.FC = () => {
  const { createAlarm } = useAlarm();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [repetitions, setRepetitions] = useState(3);
  const [startTab, setStartTab] = useState('now');
  const [specificTime, setSpecificTime] = useState<Date>(new Date());
  const [ringtone, setRingtone] = useState('/sounds/ringtone_1.mp3');
  
  // Calculate total seconds for interval
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  // Handle time input changes
  const handleHoursChange = (value: number) => setHours(value);
  const handleMinutesChange = (value: number) => setMinutes(value);
  const handleSecondsChange = (value: number) => setSeconds(value);
  const handleRepetitionsChange = (value: number) => setRepetitions(value);
  
  // Handle specific time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date();
    const [hours, minutes] = e.target.value.split(':').map(Number);
    newDate.setHours(hours, minutes, 0, 0);
    setSpecificTime(newDate);
  };
  
  // Create the alarm
  const handleCreateAlarm = () => {
    const startFromNow = startTab === 'now';
    createAlarm(
      totalSeconds,
      repetitions,
      specificTime,
      startFromNow,
      ringtone
    );
  };
  
  return (
    <Card className="w-full max-w-md mx-auto animate-scale-in shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-medium">
          <AlarmClock className="h-6 w-6 mr-2" />
          设置间隔闹钟
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Interval Setting */}
        <div className="space-y-4">
          <Label className="text-lg">间隔时长</Label>
          <div className="grid grid-cols-3 gap-4">
            <NumberInput
              value={hours}
              onChange={handleHoursChange}
              min={0}
              max={23}
              label="小时"
            />
            <NumberInput
              value={minutes}
              onChange={handleMinutesChange}
              min={0}
              max={59}
              label="分钟"
            />
            <NumberInput
              value={seconds}
              onChange={handleSecondsChange}
              min={0}
              max={59}
              label="秒"
            />
          </div>
          
          {/* Preview of interval time */}
          <div className="mt-2 text-center">
            <p className="text-sm text-muted-foreground mb-1">间隔预览</p>
            <TimeDisplay seconds={totalSeconds} className="text-2xl" />
          </div>
        </div>
        
        {/* Repetitions */}
        <div className="space-y-2">
          <Label className="text-lg">重复次数</Label>
          <NumberInput
            value={repetitions}
            onChange={handleRepetitionsChange}
            min={1}
            max={100}
            className="w-full max-w-[200px] mx-auto"
          />
        </div>
        
        {/* Start Time Setting */}
        <div className="space-y-2">
          <Label className="text-lg">开始时间</Label>
          <Tabs 
            defaultValue="now" 
            className="w-full"
            value={startTab}
            onValueChange={setStartTab}
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="now" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Clock className="h-4 w-4 mr-2" />
                立即开始
              </TabsTrigger>
              <TabsTrigger value="specific" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Clock className="h-4 w-4 mr-2" />
                指定时间
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="now" className="mt-0">
              <p className="text-center text-muted-foreground">
                闹钟将在设置后立即开始计时
              </p>
            </TabsContent>
            
            <TabsContent value="specific" className="mt-0">
              <div className="flex justify-center">
                <input
                  type="time"
                  onChange={handleTimeChange}
                  className="border rounded-md px-4 py-2 text-lg font-mono"
                  defaultValue={`${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Ringtone Selector */}
        <RingtoneSelector
          value={ringtone}
          onChange={setRingtone}
        />
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleCreateAlarm} 
          className="w-full bg-primary hover:bg-primary/90 btn-scale"
        >
          <Bell className="h-5 w-5 mr-2" />
          设置闹钟
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlarmForm;
