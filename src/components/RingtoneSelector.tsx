
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

// Default ringtones
const DEFAULT_RINGTONES = [
  { id: 'ringtone_1', name: '默认铃声', path: '/sounds/ringtone_1.mp3' },
  { id: 'ringtone_2', name: '温和铃声', path: '/sounds/ringtone_2.mp3' },
  { id: 'ringtone_3', name: '清晨铃声', path: '/sounds/ringtone_3.mp3' },
  { id: 'ringtone_4', name: '经典铃声', path: '/sounds/ringtone_4.mp3' },
];

interface RingtoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RingtoneSelector: React.FC<RingtoneSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  const [customRingtones, setCustomRingtones] = useState<Array<{ id: string; name: string; path: string }>>([]);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  // Initialize audio player
  useEffect(() => {
    const audio = new Audio();
    audio.addEventListener('ended', () => {
      setIsPlaying(null);
    });
    setAudioPlayer(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Play the selected ringtone
  const playRingtone = (ringtonePath: string) => {
    if (!audioPlayer) return;

    if (isPlaying === ringtonePath) {
      // Stop playing
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      setIsPlaying(null);
    } else {
      // Start playing
      audioPlayer.src = ringtonePath;
      audioPlayer.play().catch(err => {
        console.error('Failed to play ringtone:', err);
      });
      setIsPlaying(ringtonePath);
    }
  };

  // Handle custom ringtone upload
  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const id = `custom_${Date.now()}`;
        const url = URL.createObjectURL(file);
        const newRingtone = {
          id,
          name: file.name,
          path: url,
        };
        
        setCustomRingtones(prev => [...prev, newRingtone]);
        onChange(url);
      }
    };
    input.click();
  };

  // All ringtones
  const allRingtones = [...DEFAULT_RINGTONES, ...customRingtones];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">铃声选择</h3>
        <Button variant="outline" size="sm" onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          上传音乐
        </Button>
      </div>
      
      <ScrollArea className="h-60 border rounded-md p-4">
        <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
          {allRingtones.map((ringtone) => (
            <div 
              key={ringtone.id} 
              className={cn(
                "flex items-center justify-between px-4 py-2 rounded-md transition-colors",
                value === ringtone.path ? "bg-accent" : "hover:bg-secondary"
              )}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ringtone.path} id={ringtone.id} />
                <Label htmlFor={ringtone.id} className="cursor-pointer">
                  {ringtone.name}
                </Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => playRingtone(ringtone.path)}
                className={isPlaying === ringtone.path ? "text-primary" : ""}
              >
                <Music className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>
      </ScrollArea>
    </div>
  );
};

export default RingtoneSelector;
