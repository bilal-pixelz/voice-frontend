'use client';

import { useState, useRef, useCallback } from 'react';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  transcript: string;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetRecording: () => void;
  recordingTime: number;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    return new Promise<void>((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }
          
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          
          setIsRecording(false);
          resolve();
        };
        
        mediaRecorderRef.current.stop();
      } else {
        resolve();
      }
    });
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setTranscript('');
    setRecordingTime(0);
    chunksRef.current = [];
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  return {
    isRecording,
    audioBlob,
    transcript,
    startRecording,
    stopRecording,
    resetRecording,
    recordingTime,
  };
};
