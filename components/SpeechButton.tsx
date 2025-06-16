'use client';

import { useState, useRef } from 'react';

interface SpeechButtonProps {
  text: string;
  disabled?: boolean;
}

export default function SpeechButton({ text, disabled = false }: SpeechButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Try to initialize audio context on first user interaction
  const initializeAudio = async () => {
    if (audioPermissionGranted) return true;
    
    try {
      // Create a silent audio to test permissions
      const testAudio = new Audio();
      testAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdAz2Z3PP';
      
      const playPromise = testAudio.play();
      if (playPromise) {
        await playPromise;
        testAudio.pause();
      }
      
      setAudioPermissionGranted(true);
      return true;
    } catch (error) {
      console.log('Audio permission not yet granted');
      return false;
    }
  };

  const handleSpeak = async () => {
    if (!text.trim()) {
      alert('No text to speak!');
      return;
    }

    // If already playing, stop the audio
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    // Try to initialize audio permissions first
    const hasPermission = await initializeAudio();
    if (!hasPermission) {
      console.log('Audio permission required - will attempt anyway');
    }

    setIsLoading(true);

    try {
      console.log('Requesting TTS for text:', text.substring(0, 50) + '...');

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Create audio blob from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      // Create new audio element
      const audio = new Audio();
      audioRef.current = audio;

      // Set up event listeners before setting src
      audio.onloadstart = () => {
        console.log('Audio loading started');
      };

      audio.oncanplay = () => {
        console.log('Audio can start playing');
      };

      audio.onplay = () => {
        console.log('Audio started playing');
        setIsPlaying(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        console.log('Audio finished playing');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onpause = () => {
        console.log('Audio paused');
        setIsPlaying(false);
      };

      audio.onerror = (e) => {
        console.error('Audio element error:', e);
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
        alert('Error playing audio. Please try again.');
      };

      // Set the audio source
      audio.src = audioUrl;

      // Set the audio source and load it
      audio.src = audioUrl;
      audio.load();

      // Try to play with proper error handling
      try {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('Audio started playing successfully');
        }

      } catch (playError) {
        console.error('Audio play error:', playError);
        setIsLoading(false);
        
        // More specific error handling
        if (playError instanceof Error) {
          if (playError.name === 'NotAllowedError') {
            // Don't show an alert, just set up for retry
            console.log('Audio blocked by browser policy - will retry on next interaction');
            setIsPlaying(false);
            
            // Store the audio for potential retry
            audioRef.current = audio;
            
            // Create a one-time click listener to retry audio
            const retryPlay = async () => {
              try {
                await audio.play();
                document.removeEventListener('click', retryPlay);
              } catch (retryError) {
                console.error('Retry play failed:', retryError);
              }
            };
            
            // Add listener for next user interaction
            document.addEventListener('click', retryPlay, { once: true });
            
          } else if (playError.name === 'AbortError') {
            console.log('Audio playback was interrupted');
            setIsPlaying(false);
          } else {
            console.error('Audio playback failed:', playError.message);
            setIsPlaying(false);
            URL.revokeObjectURL(audioUrl);
          }
        } else {
          console.error('Unknown audio playback error');
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        }
      }

    } catch (error) {
      console.error('Speech generation error:', error);
      setIsLoading(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate speech';
      alert(`Speech generation failed: ${errorMessage}`);
    }
  };

  const getButtonText = () => {
    if (isLoading) return '🎤 Generating...';
    if (isPlaying) return '⏹️ Stop';
    return '🔊 Speak Poem';
  };

  const getButtonStyle = () => {
    const baseStyle = "px-6 py-3 rounded-lg font-medium transition-all duration-200 ";
    
    if (disabled || !text.trim()) {
      return baseStyle + "bg-gray-400 text-gray-200 cursor-not-allowed";
    }
    
    if (isLoading) {
      return baseStyle + "bg-yellow-500 text-white cursor-wait animate-pulse";
    }
    
    if (isPlaying) {
      return baseStyle + "bg-red-500 hover:bg-red-600 text-white shadow-lg";
    }
    
    return baseStyle + "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105";
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={disabled || isLoading || !text.trim()}
      className={getButtonStyle()}
    >
      {getButtonText()}
    </button>
  );
}