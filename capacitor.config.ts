
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.08b136c46b3a448595705723f7db6d9c',
  appName: 'alarm-echo-timer',
  webDir: 'dist',
  server: {
    url: 'https://08b136c4-6b3a-4485-9570-5723f7db6d9c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
