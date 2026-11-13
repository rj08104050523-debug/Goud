import React, { useRef, useState } from 'react';
import { Maximize2, Smartphone, Monitor } from 'lucide-react';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Brand } from './scenes/Scene2Brand';
import { Scene3Booyah } from './scenes/Scene3Booyah';
import { SceneTestimonial } from './scenes/SceneTestimonial';
import { Scene4Leaderboard } from './scenes/Scene4Leaderboard';
import { Scene5CTA } from './scenes/Scene5CTA';
import { SCENES, getActiveScene } from '../utils/promoLogic';

interface VideoPlayerProps {
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playerRef: React.RefObject<HTMLDivElement | null>;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentTime,
  isPlaying,
  onTogglePlay,
  playerRef,
}) => {
  const [deviceFrame, setDeviceFrame] = useState<'phone' | 'frameless'>('phone');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeScene = getActiveScene(currentTime);
  const sceneProgress = Math.min(
    1,
    Math.max(0, (currentTime - activeScene.startTime) / (activeScene.endTime - activeScene.startTime))
  );

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Device Mode Switch & Fullscreen Bar */}
      <div className="flex items-center justify-between w-full max-w-[380px] mb-2 px-1 text-xs text-zinc-400">
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => setDeviceFrame('phone')}
            className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors ${
              deviceFrame === 'phone'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile 9:16</span>
          </button>
          <button
            onClick={() => setDeviceFrame('frameless')}
            className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors ${
              deviceFrame === 'frameless'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Frameless</span>
          </button>
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main 9:16 Phone or Frameless Player Frame */}
      <div
        ref={containerRef}
        className={`relative transition-all duration-300 flex items-center justify-center ${
          deviceFrame === 'phone'
            ? 'p-3 bg-zinc-900 rounded-[44px] shadow-[0_0_60px_rgba(239,68,68,0.35)] border-4 border-zinc-700/80'
            : 'rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.3)] border border-zinc-800'
        }`}
      >
        {/* Phone Dynamic Island / Notch Mockup */}
        {deviceFrame === 'phone' && (
          <div className="absolute top-5 z-40 w-24 h-4 bg-black rounded-full border border-zinc-800 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700 inline-block mr-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-900/60 inline-block" />
          </div>
        )}

        {/* 9:16 Aspect Ratio Canvas Container */}
        <div
          ref={playerRef}
          onClick={onTogglePlay}
          className="relative w-[340px] sm:w-[370px] aspect-[9/16] bg-black overflow-hidden rounded-[32px] select-none cursor-pointer group"
        >
          {/* Active Scene Rendering */}
          {activeScene.id === 1 && (
            <Scene1Hook progress={sceneProgress} currentTime={currentTime} />
          )}
          {activeScene.id === 2 && (
            <Scene2Brand progress={sceneProgress} currentTime={currentTime} />
          )}
          {activeScene.id === 3 && (
            <Scene3Booyah progress={sceneProgress} currentTime={currentTime} />
          )}
          {activeScene.id === 4 && (
            <SceneTestimonial progress={sceneProgress} currentTime={currentTime} />
          )}
          {activeScene.id === 5 && (
            <Scene4Leaderboard progress={sceneProgress} currentTime={currentTime} />
          )}
          {activeScene.id === 6 && (
            <Scene5CTA progress={sceneProgress} currentTime={currentTime} />
          )}

          {/* Top Real-Time Segment Indicator Bars (like Instagram Stories / Reels) */}
          <div className="absolute top-2 left-3 right-3 z-30 flex gap-1 pointer-events-none">
            {SCENES.map((scene) => {
              const isPast = activeScene.id > scene.id;
              const isCurrent = activeScene.id === scene.id;
              return (
                <div key={scene.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-amber-400 transition-all duration-75"
                    style={{
                      width: isPast ? '100%' : isCurrent ? `${sceneProgress * 100}%` : '0%',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Subtle Floating Play Badge when paused (non-obscuring) */}
          {!isPlaying && (
            <div className="absolute inset-0 z-30 pointer-events-none flex items-end justify-end p-4 pb-28">
              <div className="w-11 h-11 rounded-full bg-red-600/85 border-2 border-white/90 flex items-center justify-center text-white shadow-[0_0_25px_#ef4444] group-hover:scale-110 transition-transform pointer-events-auto">
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
