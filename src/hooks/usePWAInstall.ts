import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // 1. Проверка дали приложението вече е инсталирано и работи в standalone режим
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isStandaloneNavigator = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const runningStandalone = isStandaloneMedia || isStandaloneNavigator;
      setIsStandalone(runningStandalone);
      if (runningStandalone) {
        setIsInstalled(true);
      }
    };

    checkStandalone();

    // 2. Детекция за iOS / iPhone / iPad (Safari)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // 3. Прихващане на събитието beforeinstallprompt за Android / Chrome / Chromium
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 4. Прихващане при успешно инсталиране
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (evt: MediaQueryListEvent) => {
      if (evt.matches) {
        setIsInstalled(true);
        setIsStandalone(true);
      }
    };
    try {
      mediaQuery.addEventListener('change', handleMediaChange);
    } catch {
      // fallback for older browsers
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      try {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } catch {
        // ignore
      }
    };
  }, []);

  // Функция за задействане на инсталация
  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'ios' | 'unsupported'> => {
    if (isInstalled || isStandalone) {
      return 'dismissed';
    }

    // За Android (Chrome) / Chromium
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          return 'accepted';
        }
        return 'dismissed';
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }

    // За iOS Safari
    if (isIOS) {
      return 'ios';
    }

    return 'unsupported';
  }, [deferredPrompt, isInstalled, isIOS, isStandalone]);

  return {
    isInstallable: !isInstalled && !isStandalone && (!!deferredPrompt || isIOS),
    hasPrompt: !!deferredPrompt,
    isInstalled: isInstalled || isStandalone,
    isIOS,
    promptInstall
  };
}
