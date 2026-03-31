import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.cbaird26.zorarefit',
  appName: 'Zora Refit',
  webDir: 'dist',
  backgroundColor: '#04050a',
  ios: {
    contentInset: 'automatic',
  },
  android: {
    backgroundColor: '#04050a',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      launchAutoHide: true,
      backgroundColor: '#04050a',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#04050a',
      overlaysWebView: false,
    },
  },
};

export default config;
