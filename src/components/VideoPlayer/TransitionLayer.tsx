import { useEffect, useState, memo } from 'react';
import { TransitionType } from '@/types/movie';
import { cn } from '@/lib/utils';

interface TransitionLayerProps {
  isTransitioning: boolean;
  transitionType: TransitionType;
  transitionDuration: number; // em ms
  onTransitionEnd?: () => void;
}

const transitionStyles: Record<TransitionType, { entering: string; exiting: string }> = {
  'crossfade': {
    entering: 'opacity-0',
    exiting: 'opacity-100',
  },
  'fade-black': {
    entering: 'bg-black opacity-100',
    exiting: 'bg-black opacity-0',
  },
  'fade-white': {
    entering: 'bg-white opacity-100',
    exiting: 'bg-white opacity-0',
  },
  'slide-left': {
    entering: 'translate-x-full',
    exiting: 'translate-x-0',
  },
  'slide-right': {
    entering: '-translate-x-full',
    exiting: 'translate-x-0',
  },
  'zoom-transition': {
    entering: 'scale-110 opacity-0',
    exiting: 'scale-100 opacity-100',
  },
  'dissolve': {
    entering: 'opacity-0 blur-sm',
    exiting: 'opacity-100 blur-0',
  },
};

export const TransitionLayer = memo(({
  isTransitioning,
  transitionType,
  transitionDuration,
  onTransitionEnd,
}: TransitionLayerProps) => {
  const [phase, setPhase] = useState<'idle' | 'entering' | 'exiting'>('idle');

  useEffect(() => {
    if (isTransitioning) {
      // Fase de entrada (fade in do overlay)
      setPhase('entering');
      
      // Metade do tempo: trocar para fase de saída
      const midTimer = setTimeout(() => {
        setPhase('exiting');
      }, transitionDuration / 2);

      // Final: resetar e notificar
      const endTimer = setTimeout(() => {
        setPhase('idle');
        onTransitionEnd?.();
      }, transitionDuration);

      return () => {
        clearTimeout(midTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isTransitioning, transitionDuration, onTransitionEnd]);

  if (phase === 'idle' && !isTransitioning) {
    return null;
  }

  const styles = transitionStyles[transitionType];
  const currentStyle = phase === 'entering' ? styles.entering : styles.exiting;

  return (
    <div
      className={cn(
        "absolute inset-0 z-30 pointer-events-none transition-all",
        currentStyle
      )}
      style={{
        transitionDuration: `${transitionDuration / 2}ms`,
        transitionTimingFunction: 'ease-in-out',
      }}
    />
  );
});

TransitionLayer.displayName = 'TransitionLayer';
