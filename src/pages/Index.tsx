
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlarmClock, List } from 'lucide-react';
import AlarmForm from '@/components/AlarmForm';
import ActiveAlarm from '@/components/ActiveAlarm';
import { AlarmProvider, useAlarm } from '@/contexts/AlarmContext';

const AlarmApp: React.FC = () => {
  const { activeAlarm } = useAlarm();
  const [activeTab, setActiveTab] = useState<string>(activeAlarm ? 'active' : 'create');
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-soft py-4 px-6">
        <div className="container max-w-md mx-auto">
          <h1 className="text-2xl font-medium flex items-center">
            <AlarmClock className="h-6 w-6 mr-2 text-primary" />
            间隔闹钟
          </h1>
        </div>
      </header>
      
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        {activeAlarm ? (
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <AlarmClock className="h-4 w-4 mr-2" />
                活动闹钟
              </TabsTrigger>
              <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <List className="h-4 w-4 mr-2" />
                创建闹钟
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-0 animate-fade-in">
              <ActiveAlarm />
            </TabsContent>
            
            <TabsContent value="create" className="mt-0 animate-fade-in">
              <AlarmForm />
            </TabsContent>
          </Tabs>
        ) : (
          <AlarmForm />
        )}
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} 间隔闹钟</p>
      </footer>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AlarmProvider>
      <AlarmApp />
    </AlarmProvider>
  );
};

export default Index;
