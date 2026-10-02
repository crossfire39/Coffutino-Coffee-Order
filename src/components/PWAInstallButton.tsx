import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { IOSInstallGuideModal } from './IOSInstallGuideModal';
import { Download, Smartphone, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  // Интелигентно скриване: ако клиентът вече е инсталирал приложението (режим standalone)
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    const result = await promptInstall();
    if (result === 'ios' || result === 'unsupported') {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'navbar' ? (
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-sm shadow-amber-900/30 transition-all active:scale-95 cursor-pointer"
          title="Инсталирай приложението на началния екран"
          aria-label="Инсталирай приложението"
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden xs:inline sm:inline">Инсталирай</span>
        </button>
      ) : (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-600/30 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
              <Download className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-100 truncate">
                  Инсталирайте приложението
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-600/30 shrink-0">
                  PWA
                </span>
              </div>
              <p className="text-[10px] text-stone-400 truncate">
                Бърз достъп с 1 докосване от вашия екран
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClick}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Инсталирай</span>
          </button>
        </div>
      )}

      {/* iOS Safari изскачащ прозорец с графични инструкции */}
      <IOSInstallGuideModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
};
