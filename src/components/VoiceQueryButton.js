'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTaskContext } from '@/contexts/TaskContext'
import { filterTasksByQuery } from '@/utils/filterUtils'

export default function VoiceQueryButton() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [voiceLevel, setVoiceLevel] = useState(0)
  const recognitionRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneRef = useRef(null)
  const animationFrameRef = useRef(null)
  const isListeningRef = useRef(false);
  const transcriptRef = useRef(''); // Add a ref to track transcript

  // Get tasks and filter function from context
  const { tasks, handleTasksFiltered, clearFiltered } = useTaskContext()
  
  // Update the isListeningRef whenever isListening changes
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);
  
  // Wrap the processVoiceQuery in useCallback to stabilize it for the dependency array
  const processVoiceQuery = useCallback((query) => {
    // Use the shared filter utility
    const filteredResults = filterTasksByQuery(tasks, query);
    
    // If null is returned, it means "show all tasks"
    if (filteredResults === null) {
      clearFiltered();
      setIsProcessing(false);
      setTranscript('');
      return;
    }
    
    // Update global filtered tasks with the voice query
    handleTasksFiltered(filteredResults, query);
    setIsProcessing(false);
    setTranscript('');
  }, [tasks, handleTasksFiltered, clearFiltered]);
  
  // Setup speech recognition
  useEffect(() => {
    if (!isListening) {
      // Clean up if not listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
        recognitionRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => console.error('Error closing audio context:', err));
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }
    
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.')
      setIsListening(false)
      return
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = false; // Changed back to false for reliability
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    let finalTranscript = '';
    
    recognition.onstart = () => {
      console.log('Speech recognition started');
      finalTranscript = '';
      setTranscript('');
      transcriptRef.current = '';
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      const currentTranscript = finalTranscript + interimTranscript;
      
      // Update both state and ref for reliable access
      setTranscript(currentTranscript);
      transcriptRef.current = currentTranscript;
      
      console.log("Current transcript:", currentTranscript);
    };
    
    recognition.onend = () => {
      const currentTranscript = transcriptRef.current;
      console.log("Recognition ended, transcript:", currentTranscript);
      
      if (currentTranscript) {
        // Only process if we have actual content
        setIsProcessing(true);
        processVoiceQuery(currentTranscript);
      }
      
      // End the listening state
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    // Start recognition with a short delay
    const startTimeout = setTimeout(() => {
      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }, 100);
    
    // Setup audio visualization
    setupAudioVisualization();
    
    return () => {
      clearTimeout(startTimeout);
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => console.error('Error closing audio context:', err));
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isListening, processVoiceQuery]);

  const setupAudioVisualization = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      microphoneRef.current = stream;
      
      // Create audio context and analyzer
      const Audiocontext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new Audiocontext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateVoiceLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate voice level (average of frequency data)
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const avg = sum / dataArray.length;
        setVoiceLevel(avg / 128); // Normalize to 0-2 range for animation
        
        animationFrameRef.current = requestAnimationFrame(updateVoiceLevel);
      };
      
      updateVoiceLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const toggleListening = () => {
    if (isListening) {
      // If already listening, stop and use the current transcript
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    } else {
      // Start new listening session
      setTranscript('');
      transcriptRef.current = '';
      setIsListening(true);
    }
  }

  // Generate wave circles for voice visualization
  const generateWaveCircles = () => {
    const circles = [];
    const circleCount = 5;
    
    for (let i = 0; i < circleCount; i++) {
      const scale = voiceLevel * (1 + i * 0.15);
      
      circles.push(
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-500/20"
          initial={{ width: 40, height: 40 }}
          animate={{ 
            width: 40 + scale * 30, 
            height: 40 + scale * 30,
            opacity: 1 - (i * 0.18)
          }}
          transition={{ duration: 0.2 }}
          style={{
            left: `calc(50% - ${(40 + scale * 30) / 2}px)`,
            top: `calc(50% - ${(40 + scale * 30) / 2}px)`,
          }}
        />
      );
    }
    
    return circles;
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative"
      >
        {isListening && generateWaveCircles()}
        
        <Button
          onClick={toggleListening}
          className={`relative z-10 rounded-full p-3 shadow-lg ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } w-12 h-12 flex items-center justify-center`}
          disabled={isProcessing}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : isListening ? (
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="text-white"
            >
              <MicOff className="h-6 w-6" />
            </motion.div>
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </Button>
      </motion.div>
      
      {/* Show transcription */}
      {(isListening && transcript) && (
        <motion.div
          className="absolute right-0 bottom-16 w-64 p-3 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ["#818cf8", "#4f46e5", "#818cf8"]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="text-indigo-400"
              >
                <Mic className="h-4 w-4" />
              </motion.div>
              <p className="text-xs font-medium text-indigo-400">Listening...</p>
            </div>
          </div>
          <p className="text-sm text-white font-medium">{transcript}</p>
        </motion.div>
      )}
    </>
  )
}