'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  disabled?: boolean;
}

// OpenAI TTS voice options
const VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and clear', emoji: '🎭' },
  { id: 'echo', name: 'Echo', description: 'Warm and expressive', emoji: '🌊' },
  { id: 'fable', name: 'Fable', description: 'Storytelling voice', emoji: '📖' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and resonant', emoji: '🗿' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic', emoji: '⭐' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle', emoji: '✨' },
] as const;

type VoiceId = typeof VOICES[number]['id'];

export default function AudioPlayer({ text, disabled = false }: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>('alloy');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Initialize audio permissions
  const initializeAudio = async () => {
    if (audioPermissionGranted) return true;
    
    try {
      const testAudio = new Audio();
      testAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdAz2Z3PP';
      
      const playPromise = testAudio.play();
      if (playPromise) {
        await playPromise;
        testAudio.pause();
      }
      
      setAudioPermissionGranted(true);
      return true;
    } catch {
      console.log('Audio permission not yet granted');
      return false;
    }
  };

  // Update time display
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, []);

  // Generate audio for the selected voice
  const generateAudio = async (voice: VoiceId) => {
    if (!text.trim()) return null;

    setIsLoading(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          voice
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return audioUrl;
    } catch (error) {
      console.error('TTS generation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Load audio for selected voice
  const loadAudio = async () => {
    try {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      const audioUrl = await generateAudio(selectedVoice);
      if (!audioUrl) return;

      audioUrlRef.current = audioUrl;

      const audio = new Audio();
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        console.error('Audio playback error');
      };

      audio.src = audioUrl;
      audio.load();

    } catch (error) {
      console.error('Failed to load audio:', error);
    }
  };

  // Play/Pause functionality
  const handlePlayPause = async () => {
    await initializeAudio();

    if (!audioRef.current || audioRef.current.src === '') {
      await loadAudio();
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Play failed:', error);
        }
      }
    }
  };

  // Stop functionality
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // Restart functionality
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // Voice change handler
  const handleVoiceChange = async (voice: VoiceId) => {
    setSelectedVoice(voice);
    // Stop current audio and clear it so it reloads with new voice
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  // Format time display
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!text.trim()) {
    return (
      <div style={{
        textAlign: 'center',
        color: '#ddd6fe',
        padding: '32px',
        fontSize: '1rem'
      }}>
        Generate a poem to use the audio player
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: 'all 0.3s ease'
    }}>
      {/* Voice Selection */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          color: 'white',
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Volume2 style={{ width: '20px', height: '20px' }} />
          Choose Voice
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px'
        }}>
          {VOICES.map((voice) => (
            <div
              key={voice.id}
              onClick={() => handleVoiceChange(voice.id)}
              style={{
                background: selectedVoice === voice.id 
                  ? 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: selectedVoice === voice.id 
                  ? '2px solid white' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedVoice === voice.id ? 'scale(1.05)' : 'scale(1)',
                backdropFilter: 'blur(8px)',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (selectedVoice !== voice.id && !isLoading) {
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)';
                  (e.target as HTMLElement).style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedVoice !== voice.id && !isLoading) {
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                  (e.target as HTMLElement).style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{
                fontSize: '1.5rem',
                marginBottom: '8px'
              }}>
                {voice.emoji}
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '4px',
                fontFamily: 'inherit'
              }}>
                {voice.name}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: selectedVoice === voice.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                lineHeight: '1.3'
              }}>
                {voice.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Display */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.875rem',
          color: '#ddd6fe',
          marginBottom: '8px'
        }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div style={{
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50px',
          height: '8px',
          overflow: 'hidden'
        }}>
          <div 
            style={{
              background: 'linear-gradient(90deg, #c4b5fd 0%, #60a5fa 100%)',
              height: '8px',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              width: duration ? `${(currentTime / duration) * 100}%` : '0%'
            }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleRestart}
          disabled={disabled || isLoading || !audioRef.current}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 20px',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '50px',
            border: 'none',
            cursor: (disabled || isLoading || !audioRef.current) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            transform: 'scale(1)',
            background: (disabled || isLoading || !audioRef.current) 
              ? '#6b7280' 
              : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            opacity: (disabled || isLoading || !audioRef.current) ? 0.5 : 1,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (!(disabled || isLoading || !audioRef.current)) {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.3)';
              (e.target as HTMLElement).style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!(disabled || isLoading || !audioRef.current)) {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }
          }}
        >
          <RotateCcw style={{ width: '20px', height: '20px' }} />
          Restart
        </button>

        <button
          onClick={handlePlayPause}
          disabled={disabled || isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '16px 32px',
            fontSize: '1.125rem',
            fontWeight: '600',
            borderRadius: '50px',
            border: 'none',
            cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            transform: 'scale(1)',
            background: disabled 
              ? '#6b7280'
              : isLoading
              ? 'linear-gradient(90deg, #eab308 0%, #f59e0b 100%)'
              : 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
            color: 'white',
            opacity: disabled ? 0.5 : 1,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: isLoading ? 'pulse 2s infinite' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!disabled && !isLoading) {
              (e.target as HTMLElement).style.background = 'linear-gradient(90deg, #9333ea 0%, #be185d 100%)';
              (e.target as HTMLElement).style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !isLoading) {
              (e.target as HTMLElement).style.background = 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)';
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Generating...
            </>
          ) : isPlaying ? (
            <>
              <Pause style={{ width: '20px', height: '20px' }} />
              Pause
            </>
          ) : (
            <>
              <Play style={{ width: '20px', height: '20px' }} />
              Play
            </>
          )}
        </button>

        <button
          onClick={handleStop}
          disabled={disabled || isLoading || !audioRef.current}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 20px',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '50px',
            border: 'none',
            cursor: (disabled || isLoading || !audioRef.current) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            transform: 'scale(1)',
            background: (disabled || isLoading || !audioRef.current) 
              ? '#6b7280' 
              : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            opacity: (disabled || isLoading || !audioRef.current) ? 0.5 : 1,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (!(disabled || isLoading || !audioRef.current)) {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.3)';
              (e.target as HTMLElement).style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!(disabled || isLoading || !audioRef.current)) {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }
          }}
        >
          <Square style={{ width: '20px', height: '20px' }} />
          Stop
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          marginTop: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            color: '#fbbf24',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Generating audio with {VOICES.find(v => v.id === selectedVoice)?.name} voice...
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}