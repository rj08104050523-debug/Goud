import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Film, Sparkles } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer';
import { StudioControls } from '../components/StudioControls';
import { DescriptionCard } from '../components/DescriptionCard';
import { TournamentLobbyModal } from '../components/TournamentLobbyModal';
import { SCENES, TOTAL_DURATION, getActiveScene, formatTime } from '../utils/promoLogic';
import { audioEngine } from '../utils/audioEngine';

export const PromoStudioPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://devesports.in');
  const [whatsappUrl, setWhatsappUrl] = useState<string>('https://chat.whatsapp.com/DevEsportsOfficial');
  const [lobbyOpen, setLobbyOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const playerRef = useRef<HTMLDivElement | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);
  const lastSpokenSceneIdRef = useRef<number | null>(null);

  const activeScene = getActiveScene(currentTime);

  const notify = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const triggerSfxBetween = useCallback((fromTime: number, toTime: number) => {
    if (toTime <= fromTime) return;
    for (const scene of SCENES) {
      for (const sfx of scene.sfxTriggers) {
        if (sfx.time > fromTime && sfx.time <= toTime) {
          if (sfx.type === 'whoosh') audioEngine.playWhoosh();
          else if (sfx.type === 'bass_drop') audioEngine.playBassDrop();
          else if (sfx.type === 'coin') audioEngine.playCoinSound();
          else if (sfx.type === 'headshot') audioEngine.playHeadshot();
          else if (sfx.type === 'booyah') audioEngine.playBooyah();
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      audioEngine.stopTrapBeat();
      lastFrameTimeRef.current = null;
      return;
    }

    audioEngine.startTrapBeat();
    const initialScene = getActiveScene(currentTime);
    if (lastSpokenSceneIdRef.current !== initialScene.id) {
      lastSpokenSceneIdRef.current = initialScene.id;
      audioEngine.speakVoiceover(initialScene.voiceover);
    }

    let rafId = 0;

    const tick = (now: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = now;
      }
      const deltaSec = Math.min(0.1, (now - lastFrameTimeRef.current) / 1000) * playbackRate;
      lastFrameTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = Math.min(TOTAL_DURATION, prev + deltaSec);
        triggerSfxBetween(prevTimeRef.current, next);
        prevTimeRef.current = next;

        const nextScene = getActiveScene(next);
        if (lastSpokenSceneIdRef.current !== nextScene.id) {
          lastSpokenSceneIdRef.current = nextScene.id;
          audioEngine.speakVoiceover(nextScene.voiceover);
        }

        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          audioEngine.stopTrapBeat();
        }
        return next;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      audioEngine.stopTrapBeat();
    };
  }, [isPlaying, playbackRate, triggerSfxBetween]);

  useEffect(() => {
    return () => {
      audioEngine.stopTrapBeat();
      audioEngine.stopAllVoice();
    };
  }, []);

  const handleTogglePlay = () => {
    if (!isPlaying && currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      prevTimeRef.current = 0;
      lastSpokenSceneIdRef.current = null;
    }
    if (isPlaying) {
      audioEngine.stopAllVoice();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_DURATION, seconds));
    setCurrentTime(clamped);
    prevTimeRef.current = clamped;
    const targetScene = getActiveScene(clamped);
    if (isPlaying && lastSpokenSceneIdRef.current !== targetScene.id) {
      lastSpokenSceneIdRef.current = targetScene.id;
      audioEngine.speakVoiceover(targetScene.voiceover);
    } else if (!isPlaying) {
      lastSpokenSceneIdRef.current = null;
    }
  };

  const handleRestart = () => {
    audioEngine.stopAllVoice();
    setCurrentTime(0);
    prevTimeRef.current = 0;
    lastSpokenSceneIdRef.current = null;
    setIsPlaying(true);
  };

  const drawSceneCanvasFrame = (ctx: CanvasRenderingContext2D, timeSec: number) => {
    const scene = getActiveScene(timeSec);
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#09090b');
    grad.addColorStop(0.5, scene.id === 4 ? '#042f2e' : '#1f0808');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = scene.id === 4 ? '#22d3ee' : '#f59e0b';
    ctx.lineWidth = 8;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`DEV ESPORTS · SCENE ${scene.id}/${SCENES.length}`, 80, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 62px sans-serif';
    ctx.fillText(scene.headline.slice(0, 28), 80, h / 2 - 40);

    ctx.fillStyle = scene.id === 4 ? '#34d399' : '#fca5a5';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(scene.subheadline, 80, h / 2 + 30);

    ctx.fillStyle = '#e4e4e7';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`"${scene.voiceover.slice(0, 52)}"`, 80, h - 180);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`${formatTime(timeSec)} / ${formatTime(TOTAL_DURATION)}`, 80, h - 90);
  };

  const handleCaptureFrame = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      drawSceneCanvasFrame(ctx, currentTime);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `devesports-scene-${activeScene.id}.png`;
      a.click();
      notify(`Saved Scene ${activeScene.id} thumbnail cover!`);
    } catch {
      notify('Unable to generate thumbnail in this browser.');
    }
  };

  const handleExportVideo = () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 540;
      canvas.height = 960;
      const ctx = canvas.getContext('2d');

      if (!ctx || typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
        setIsExporting(false);
        handleCaptureFrame();
        return;
      }

      const stream = canvas.captureStream(24);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devesports-promo-${TOTAL_DURATION}s.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        notify(`Exported ${TOTAL_DURATION}s Promo Video!`);
      };

      recorder.start();
      let t = currentTime;
      const interval = window.setInterval(() => {
        drawSceneCanvasFrame(ctx, t);
        t += 0.25;
        if (t >= Math.min(TOTAL_DURATION, currentTime + 2.5)) {
          clearInterval(interval);
          recorder.stop();
        }
      }, 60);
    } catch {
      setIsExporting(false);
      notify('Video export requires MediaRecorder support.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <Film className="w-4 h-4" />
            <span>PROMO REEL STUDIO · {TOTAL_DURATION} SECONDS</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase mt-1">
            DEV ESPORTS 9:16 PROMO VIDEO
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Includes the 5s energetic Hinglish winner testimonial with quick cuts &amp; neon glow typography.
          </p>
        </div>

        <button
          onClick={() => handleSeek(SCENES[3].startTime)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center gap-2 shrink-0 transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>JUMP TO 5S TESTIMONIAL</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 flex justify-center">
          <VideoPlayer
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            playerRef={playerRef}
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <StudioControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            playbackRate={playbackRate}
            activeSceneId={activeScene.id}
            onPlayPause={handleTogglePlay}
            onSeek={handleSeek}
            onRestart={handleRestart}
            onChangeSpeed={setPlaybackRate}
            onOpenLobby={() => setLobbyOpen(true)}
            onExportVideo={handleExportVideo}
            onCaptureFrame={handleCaptureFrame}
            isExporting={isExporting}
          />

          <DescriptionCard
            websiteUrl={websiteUrl}
            whatsappUrl={whatsappUrl}
            onUpdateWebsite={setWebsiteUrl}
            onUpdateWhatsapp={setWhatsappUrl}
          />
        </div>
      </div>

      <TournamentLobbyModal
        isOpen={lobbyOpen}
        onClose={() => setLobbyOpen(false)}
        websiteUrl={websiteUrl}
        whatsappUrl={whatsappUrl}
      />

      {statusNotice && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-2.5 bg-zinc-900 border border-cyan-500 rounded-xl shadow-2xl text-xs font-bold text-cyan-300">
          {statusNotice}
        </div>
      )}
    </div>
  );
};
