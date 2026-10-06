'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type PlayerState = 'idle' | 'playing' | 'paused' | 'unavailable';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface AudioPlayerProps {
  src: string | null;
  title: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(src ? 'idle' : 'unavailable');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setState('playing');
    const onPause = () => setState((s) => (s === 'unavailable' ? s : 'paused'));
    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setState('paused');
      setProgress(0);
      audio.currentTime = 0;
    };
    const onError = () => setState('unavailable');

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (audio.paused) {
      void audio.play().catch(() => setState('unavailable'));
    } else {
      audio.pause();
    }
  }, [src]);

  if (state === 'unavailable') {
    return (
      <div
        data-testid="audio-player"
        data-state="unavailable"
        className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-sm text-muted"
        role="status"
      >
        <span aria-hidden="true">♪</span>
        <span>Audio unavailable for this episode — transcript coming soon.</span>
      </div>
    );
  }

  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

  return (
    <div
      data-testid="audio-player"
      data-state={state}
      className="flex w-full max-w-xl items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4"
    >
      <audio ref={audioRef} src={src ?? undefined} preload="metadata" />
      <button
        type="button"
        data-testid="audio-toggle"
        data-state={state}
        aria-pressed={state === 'playing'}
        aria-label={state === 'playing' ? `Pause ${title}` : `Play ${title}`}
        onClick={toggle}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-200 hover:scale-105 hover:bg-gold-strong"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {state === 'playing' ? '❚❚' : '▶'}
        </span>
      </button>
      <div className="min-w-0 flex-1">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-label={`Playback progress for ${title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
        >
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 flex justify-between text-xs tabular-nums text-muted">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </p>
      </div>
    </div>
  );
}
