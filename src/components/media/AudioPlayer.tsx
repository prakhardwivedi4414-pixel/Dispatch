import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title: string;
  episodeNumber?: string;
  byline?: string;
  duration?: string;
  coverImage?: string;
  scriptText?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  episodeNumber = 'Investigative Dispatch #04',
  byline = 'The Dispatch Audio Desk',
  duration = '07:42',
  coverImage,
  scriptText,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(462); // 07:42 default in seconds
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showScript, setShowScript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setTotalDuration(audio.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.warn('Audio play request interrupted:', err);
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
      audioRef.current.volume = volume || 0.8;
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const rewind10 = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-paper-200 border-2 border-ink-900 shadow-sm p-6 my-8 rounded-none">
      {/* Hidden real audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pb-5 border-b border-rule">
        <div className="flex items-center gap-4">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-20 h-20 object-cover border border-ink-900 shadow-inner flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 bg-ink-900 text-paper-100 flex flex-col items-center justify-center p-2 text-center flex-shrink-0">
              <span className="font-serif text-xl font-bold tracking-wider">AUDIO</span>
              <span className="text-[10px] uppercase tracking-widest text-editorial-red">Podcast</span>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-editorial-red">
                {episodeNumber}
              </span>
              <span className="text-xs text-ink-500">•</span>
              <span className="text-xs text-ink-600 font-mono">Verified Audio Master</span>
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-ink-950 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-ink-600 mt-1">{byline}</p>
          </div>
        </div>

        {/* Script toggle button */}
        {scriptText && (
          <button
            onClick={() => setShowScript(!showScript)}
            className="flex items-center gap-2 px-3 py-1.5 border border-ink-900 bg-paper-100 hover:bg-paper-50 text-xs font-semibold uppercase tracking-wider transition-colors"
            title="Toggle broadcast script"
          >
            <FileText className="w-4 h-4 text-editorial-red" />
            <span>{showScript ? 'Hide Script' : 'View Broadcast Script'}</span>
          </button>
        )}
      </div>

      {/* Waveform / Visualizer animation bar */}
      <div className="py-4">
        <div className="flex items-end justify-between gap-[2px] h-9 px-1 mb-2 opacity-80 overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => {
            const progressRatio = currentTime / (totalDuration || 1);
            const isPassed = i / 48 <= progressRatio;
            const barHeight = Math.max(15, (Math.sin(i * 0.4) * 0.5 + 0.5) * 100);
            return (
              <div
                key={i}
                className={`w-full rounded-none transition-all duration-150 ${
                  isPassed ? 'bg-editorial-red' : 'bg-rule'
                } ${isPlaying ? 'animate-pulse' : ''}`}
                style={{
                  height: `${barHeight}%`,
                  animationDelay: `${(i % 10) * 0.08}s`,
                }}
              />
            );
          })}
        </div>

        {/* Scrubber slider */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={totalDuration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-rule-light accent-editorial-red cursor-pointer"
            aria-label="Seek audio position"
          />
        </div>

        {/* Time display */}
        <div className="flex justify-between items-center text-xs font-mono text-ink-600 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span className="text-editorial-red font-semibold">Target: 5–10 min</span>
          <span>{formatTime(totalDuration)} ({duration})</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-rule">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-editorial-red hover:bg-editorial-red-dark text-white rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95"
            aria-label={isPlaying ? 'Pause podcast' : 'Play podcast'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={rewind10}
            className="p-2 border border-rule hover:border-ink-900 bg-paper-100 text-ink-700 transition-colors"
            title="Rewind 10 seconds"
            aria-label="Rewind 10 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={cyclePlaybackRate}
            className="px-2.5 py-1 text-xs font-mono font-bold border border-rule hover:border-ink-900 bg-paper-100 text-ink-800 transition-colors"
            title="Change playback speed"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-ink-600 hover:text-ink-900 p-1"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            className="w-20 md:w-24 h-1.5 bg-rule accent-editorial-red cursor-pointer"
            aria-label="Adjust volume"
          />
        </div>
      </div>

      {/* Broadcast script panel */}
      {showScript && scriptText && (
        <div className="mt-6 pt-5 border-t-2 border-dashed border-rule">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif text-lg font-bold text-ink-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-editorial-red" />
              Accompanying Broadcast Script & Transcript
            </h4>
            <span className="text-xs font-mono text-ink-500 uppercase">Verbatim Record</span>
          </div>
          <div className="bg-paper-100 border border-rule p-4 font-mono text-xs md:text-sm text-ink-800 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-line shadow-inner">
            {scriptText}
          </div>
        </div>
      )}
    </div>
  );
};
