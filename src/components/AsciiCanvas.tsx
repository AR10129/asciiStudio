import React, { useRef, useEffect, useState } from 'react';
import type { AsciiOptions } from '../types';
import { getAsciiChar } from '../utils/asciiConverter';
import { Camera, Repeat, Image as ImageIcon } from 'lucide-react';

interface AsciiCanvasProps {
  options: AsciiOptions;
  onCapture: (imageData: string) => void;
  onOpenGallery: () => void;
  hasNewCapture: boolean;
}

export const AsciiCanvas: React.FC<AsciiCanvasProps> = ({ options, onCapture, onOpenGallery, hasNewCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const framesRef = useRef<ImageData[]>([]);
  const isRecordingRef = useRef(false);
  const frameCountRef = useRef(0);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(e => console.error(e));
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current && canvasRef.current.parentElement) {
            canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
            canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    // Run once after slight delay to ensure container is sized
    setTimeout(handleResize, 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const renderLoop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const hiddenCanvas = hiddenCanvasRef.current;
      
      if (!video || !canvas || !hiddenCanvas || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const ctx = canvas.getContext('2d', { alpha: false });
      const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });

      if (!ctx || !hiddenCtx) {
          animationRef.current = requestAnimationFrame(renderLoop);
          return;
      }

      const charHeight = options.fontSize;
      const charWidth = charHeight * 0.6;
      
      const cols = Math.floor(canvas.width / charWidth);
      const rows = Math.floor(canvas.height / charHeight);

      if (cols <= 0 || rows <= 0) {
        animationRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      if (hiddenCanvas.width !== cols || hiddenCanvas.height !== rows) {
        hiddenCanvas.width = cols;
        hiddenCanvas.height = rows;
      }

      hiddenCtx.save();
      hiddenCtx.translate(cols, 0);
      hiddenCtx.scale(-1, 1);
      hiddenCtx.drawImage(video, 0, 0, cols, rows);
      hiddenCtx.restore();
      
      const frameData = hiddenCtx.getImageData(0, 0, cols, rows);
      const data = frameData.data;

      ctx.fillStyle = '#0a0a0a'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${options.fontSize}px 'Share Tech Mono', monospace`;
      ctx.textBaseline = 'top';

      const contrastFactor = (259 * (options.contrast * 255 + 255)) / (255 * (259 - options.contrast * 255));

      for (let y = 0; y < rows; y++) {
        let currentSegment = "";
        let currentColor = "";
        let startX = 0;

        for (let x = 0; x < cols; x++) {
            const offset = (y * cols + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            
            let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            brightness = contrastFactor * (brightness - 128) + 128;
            brightness *= options.brightness;
            brightness = Math.max(0, Math.min(255, brightness));

            let color = options.subjectColor;
            if (options.isDualColor && brightness < options.colorThreshold) {
                color = options.bgColor;
            }

            if (color !== currentColor) {
                if (currentSegment) {
                    ctx.fillStyle = currentColor;
                    ctx.fillText(currentSegment, startX * charWidth, y * charHeight);
                }
                currentColor = color;
                currentSegment = getAsciiChar(brightness, options.density);
                startX = x;
            } else {
                currentSegment += getAsciiChar(brightness, options.density);
            }
        }
        if (currentSegment) {
            ctx.fillStyle = currentColor;
            ctx.fillText(currentSegment, startX * charWidth, y * charHeight);
        }
      }

      if (isRecordingRef.current) {
        frameCountRef.current++;
        // Capture every 2nd frame to reduce memory and artificially speed it up
        if (frameCountRef.current % 2 === 0) {
            framesRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
      }

      animationRef.current = requestAnimationFrame(renderLoop);
    };

    animationRef.current = requestAnimationFrame(renderLoop);
    return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [options]);

  const handleScreenshotClick = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onCapture(dataUrl);
    }
  };

  const processBoomerang = async () => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsProcessing(false);
      return;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      setIsProcessing(false);
      return;
    }

    // Try mp4 first for maximum mobile compatibility, fallback to webm
    let mimeType = 'video/mp4';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    // Playback at 45 fps to make it significantly faster
    const stream = tempCanvas.captureStream(45);
    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result as string;
        onCapture(base64data);
        setIsProcessing(false);
      }
    };

    mediaRecorder.start();

    // Create boomerang sequence: forward -> backward -> forward -> backward
    const frames = framesRef.current;
    const sequence = [...frames, ...[...frames].reverse(), ...frames, ...[...frames].reverse()];

    for (let i = 0; i < sequence.length; i++) {
      tempCtx.putImageData(sequence[i], 0, 0);
      await new Promise(r => setTimeout(r, 1000 / 45)); 
    }

    mediaRecorder.stop();
  };

  const handleBoomerangClick = () => {
    if (isRecordingRef.current || isProcessing) return;
    
    setIsRecording(true);
    isRecordingRef.current = true;
    framesRef.current = [];
    frameCountRef.current = 0;
    
    // Record for 2.5 seconds (was 1.5s)
    setTimeout(() => {
      isRecordingRef.current = false;
      setIsRecording(false);
      processBoomerang();
    }, 2500);
  };

  return (
    <div className={`relative w-full h-full brutalist-box flex flex-col items-center justify-center ${options.glitch ? 'glitch-effect' : ''}`}>
        <video 
            ref={videoRef} 
            className="absolute top-0 left-0 opacity-0 pointer-events-none -z-10 w-1 h-1" 
            playsInline autoPlay muted 
        />
        <canvas ref={hiddenCanvasRef} className="hidden" />
        <canvas ref={canvasRef} className="block w-full h-full" />
        
        <div className="absolute bottom-6 flex items-center gap-6 z-40 bg-brutalDark/80 p-2 brutalist-border">
            <button 
                onClick={handleScreenshotClick}
                disabled={isRecording || isProcessing}
                className="brutalist-button bg-brutalLight text-brutalDark px-4 py-2 flex items-center gap-2 disabled:opacity-50"
                title="Save Snapshot"
            >
                <Camera className="w-5 h-5" /> SNAP
            </button>

            <button 
                onClick={handleBoomerangClick}
                disabled={isRecording || isProcessing}
                className={`brutalist-button px-4 py-2 flex items-center gap-2 ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : isProcessing 
                    ? 'bg-yellow-500 text-black'
                    : 'bg-brutalDark text-neonPink brutalist-button-pink'
                }`}
                title="Capture Boomerang"
            >
                {isRecording ? (
                  <><div className="w-3 h-3 rounded-full bg-white animate-ping mr-2" /> RECORDING...</>
                ) : isProcessing ? (
                  <><Repeat className="w-5 h-5 animate-spin" /> PROCESSING...</>
                ) : (
                  <><Repeat className="w-5 h-5" /> BOOMERANG</>
                )}
            </button>

            <button 
                onClick={onOpenGallery}
                className="brutalist-button bg-brutalDark text-brutalLight px-4 py-2 flex items-center gap-2 relative"
                title="Open Gallery"
            >
                <ImageIcon className="w-5 h-5" /> <span className="hidden sm:inline">GALLERY</span>
                {hasNewCapture && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-neonGreen rounded-full animate-ping"></span>
                )}
                {hasNewCapture && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-neonGreen rounded-full border border-brutalDark"></span>
                )}
            </button>
        </div>
    </div>
  );
};
