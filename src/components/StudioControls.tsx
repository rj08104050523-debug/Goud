import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Download,
  Camera,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SCENES, TOTAL_DURATION, formatTime } from '../utils/promoLogic';
import { audioEngine } from '../utils/audioEngine';

interface StudioControlsProps {
  isPlaying: boolean;
  currentTime: number;
  playbackRate: number;
  activeSceneId: number;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
  onRestart: () => void;
  onChangeSpeed: (speed: number) => void;
  onOpenLobby: () => void;
  onExportVideo: () => void;
  onCaptureFrame: () => void;
  isExporting: boolean;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  isPlaying,
  currentTime,
  playbackRate,
  activeSceneId,
  onPlayPause,
  onSeek,
  onRestart,
  onChangeSpeed,
  onOpenLobby,
  onExportVideo,
  onCaptureFrame,
  isExporting,
}) => {
  const [showAudioMixer, setShowAudioMixer] = useState(false);
  const [isMuted, setIsMuted] = useState(audioEngine.isMuted);
  const [masterVol, setMasterVol] = useState(audioEngine.masterVolume);
  const [musicVol, setMusicVol] = useState(audioEngine.musicVolume);
  const [sfxVol, setSfxVol] = useState(audioEngine.sfxVolume);
  const [voiceVol, setVoiceVol] = useState(audioEngine.voiceVolume);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioEngine.setMute(next);
  };

  const handleVolumeChange = (type: 'master' | 'music' | 'sfx' | 'voice', val: number) => {
    if (type === 'master') setMasterVol(val);
    if (type === 'music') setMusicVol(val);
    if (type === 'sfx') setSfxVol(val);
    if (type === 'voice') setVoiceVol(val);

    audioEngine.setVolumes(
      type === 'master' ? val : masterVol,
      type === 'music' ? val : musicVol,
      type === 'sfx' ? val : sfxVol,
      type === 'voice' ? val : voiceVol
    );
  };

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Bar: Playback Status & Jump to Scene */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-red-600/30 border border-red-500 rounded-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-display font-black text-sm text-white tracking-wider">
              PROMO TIMELINE: {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
            </span>
          </div>

          <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-xs">
            {[0.5, 1, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-1 rounded font-mono-num font-bold transition-colors ${
                  playbackRate === spd
                    ? 'bg-amber-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAudioMixer(!showAudioMixer)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border ${
              showAudioMixer
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Sound & SFX</span>
          </button>

          <button
            onClick={onOpenLobby}
            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Tournament Lobby</span>
          </button>
        </div>
      </div>

      {/* Primary Timeline Scrubber */}
      <div className="space-y-1.5">
        <div className="relative w-full h-3 bg-zinc-900 rounded-full overflow-hidden cursor-pointer group border border-zinc-800">
          {/* Progress fill */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-600 via-amber-500 to-red-500 transition-all duration-75 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
          />

          {/* Scene Dividers on Timeline */}
          {SCENES.map((sc) => (
            <div
              key={sc.id}
              className="absolute top-0 bottom-0 w-0.5 bg-zinc-700/80 group-hover:bg-white/60 pointer-events-none"
              style={{ left: `${(sc.startTime / TOTAL_DURATION) * 100}%` }}
            />
          ))}

          {/* Native Range input layered for drag */}
          <input
            type="range"
            min={0}
            max={TOTAL_DURATION}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            aria-label="Video scrubber"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        {/* Scene Jump Markers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 pt-1">
          {SCENES.map((sc) => {
            const isActive = activeSceneId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSeek(sc.startTime)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isActive
                    ? 'bg-zinc-900 border-amber-500 shadow-md shadow-amber-950/40'
                    : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono-num font-bold">
                  <span className={isActive ? 'text-amber-400' : 'text-zinc-500'}>
                    Scene {sc.id}
                  </span>
                  <span className="text-zinc-500">{sc.startTime}s-{sc.endTime}s</span>
                </div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {sc.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Transport Controls & Export Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-display font-black text-sm tracking-wider uppercase shadow-lg shadow-red-900/40 flex items-center gap-2 transition-transform active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE PROMO</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY PROMO ({TOTAL_DURATION}S)</span>
              </>
            )}
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            aria-label="Restart video"
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        {/* Video & Poster Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCaptureFrame}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Thumbnail Cover</span>
          </button>

          <button
            onClick={onExportVideo}
            disabled={isExporting}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black font-display font-black text-xs tracking-wider uppercase rounded-xl shadow-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'RECORDING VIDEO...' : 'EXPORT 9:16 VIDEO'}</span>
          </button>
        </div>
      </div>

      {/* Audio Mixer & Soundboard Drawer */}
      {showAudioMixer && (
        <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Layers className="w-4 h-4" />
              <span>AUDIO DESIGN MIXER & SOUNDBOARD</span>
            </span>
            <span className="text-[11px] text-zinc-500">
              Heavy Trap Beat (140 BPM) + Cinematic Sound Effects
            </span>
          </div>

          {/* Volume Sliders Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 text-zinc-400">
                <span>Master Vol</span>
                <span className="font-mono-num">{Math.round(masterVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVol}
                onChange={(e) => handleVolumeChange('master', parseFloat(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-zinc-400">
                <span>Trap Beat (808s)</span>
                <span className="font-mono-num">{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-zinc-400">
                <span>SFX Effects</span>
                <span className="font-mono-num">{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-zinc-400">
                <span>Voiceover</span>
                <span className="font-mono-num">{Math.round(voiceVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={voiceVol}
                onChange={(e) => handleVolumeChange('voice', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Soundboard Test Buttons */}
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
              Instant Soundboard Test:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => audioEngine.playWhoosh()}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg border border-zinc-700"
              >
                💨 Transition Whoosh
              </button>
              <button
                onClick={() => audioEngine.playBassDrop()}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg border border-zinc-700"
              >
                💣 808 Bass Drop
              </button>
              <button
                onClick={() => audioEngine.playCoinSound()}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold rounded-lg border border-zinc-700"
              >
                💰 Cash Prize Coin
              </button>
              <button
                onClick={() => audioEngine.playHeadshot()}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-red-400 text-xs font-bold rounded-lg border border-zinc-700"
              >
                🎯 Sniper Headshot
              </button>
              <button
                onClick={() => audioEngine.playBooyah()}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-bold rounded-lg border border-zinc-700"
              >
                🏆 Booyah Fanfare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
