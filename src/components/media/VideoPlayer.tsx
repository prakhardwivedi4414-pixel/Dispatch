import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, FileText, CheckCircle2 } from 'lucide-react';

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title: string;
  duration?: string;
  caption?: string;
  credit?: string;
  scriptText?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  duration = '01:52',
  caption,
  credit,
  scriptText,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(112); // 01:52 default
  const [showScript, setShowScript] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(err => {
        console.warn('Video playback error:', err);
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setTotalDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="my-8">
      {/* Video Container */}
      <div className="relative aspect-video bg-black overflow-hidden border-2 border-ink-900 group shadow-md" aria-label={title || 'Video Player'}>
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            playsInline
            controls={false}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-paper-200 p-8 text-center bg-ink-950">
            <span className="font-serif text-2xl font-bold tracking-wider text-paper-100 mb-2">VIDEO DESK</span>
            <p className="text-sm text-ink-400 max-w-md">
              No video asset source linked. Insert a valid MP4 or web video URL in the Story Editor.
            </p>
          </div>
        )}

        {/* Large Play Overlay on Idle */}
        {!isPlaying && src && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/30"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-editorial-red text-white flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-105">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Duration badge top right */}
        <div className="absolute top-4 right-4 bg-ink-950/80 backdrop-blur-sm text-paper-100 text-xs font-mono px-2.5 py-1 border border-paper-100/20">
          {formatTime(currentTime)} / {duration}
        </div>

        {/* Floating Custom Video Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Scrubber */}
          <input
            type="range"
            min={0}
            max={totalDuration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/30 accent-editorial-red cursor-pointer mb-3"
            aria-label="Seek video position"
          />

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="hover:text-editorial-red transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              <button
                onClick={toggleMute}
                className="hover:text-editorial-red transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <span className="font-mono">{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
            </div>

            <div className="flex items-center gap-3">
              {scriptText && (
                <button
                  onClick={() => setShowScript(!showScript)}
                  className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 uppercase text-[10px] tracking-wider transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Script</span>
                </button>
              )}
              <button
                onClick={handleFullscreen}
                className="hover:text-editorial-red transition-colors"
                aria-label="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Caption and Credits */}
      {(caption || credit) && (
        <div className="mt-3 flex flex-col sm:flex-row sm:items-baseline justify-between text-xs text-ink-600 gap-2 border-b border-rule pb-3">
          {caption && <p className="font-serif italic text-ink-800 text-sm">{caption}</p>}
          {credit && <span className="font-mono text-[11px] text-ink-500 flex-shrink-0">{credit}</span>}
        </div>
      )}

      {/* Script Drawer */}
      {showScript && scriptText && (
        <div className="mt-4 p-5 bg-paper-200 border border-ink-900 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-rule pb-2">
            <h4 className="font-serif text-base font-bold text-ink-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-editorial-red" />
              Accompanying Video Report Script & Shot List
            </h4>
            <span className="text-[10px] uppercase font-mono tracking-wider text-editorial-red">
              Required Submission Asset
            </span>
          </div>
          <div className="bg-paper-100 p-4 font-mono text-xs text-ink-800 whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto border border-rule">
            {scriptText}
          </div>
        </div>
      )}
    </div>
  );
};
