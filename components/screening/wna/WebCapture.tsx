// components/WebcamCapture.tsx
'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, Repeat, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

export function WebcamCapture({ onCapture, isActive, setIsActive }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = useCallback(() => {
    if (isCapturing) return;

    setIsCapturing(true);
    try {
      const imageSrc = webcamRef.current?.getScreenshot({
        width: 1280,
        height: 720,
      });

      if (imageSrc) {
        onCapture(imageSrc);
        setIsActive(false);
        toast.success('ID photo captured successfully');
      } else {
        throw new Error('Failed to capture photo');
      }
    } catch (error) {
      console.error('Capture error:', error);
      toast.error('Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [onCapture, setIsActive, isCapturing]);

  const toggleFacingMode = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  const handleUserMedia = () => {
    setHasPermission(true);
    setError(null);
  };

  const handleUserMediaError = (err: string | DOMException) => {
    console.error('Webcam error:', err);
    setHasPermission(false);

    const errorName = typeof err === 'string' ? err : err.name;
    const errorMessage = typeof err === 'string' ? err : err.message;

    if (errorName === 'NotAllowedError') {
      setError('Camera permission denied. Enable camera access in your browser settings.');
    } else if (errorName === 'NotFoundError') {
      setError('Camera not found. Make sure your device has a camera.');
    } else if (errorName === 'NotReadableError') {
      setError('Camera is being used by another application. Close other apps and try again.');
    } else if (errorName === 'OverconstrainedError') {
      setError('Camera configuration not supported. Try a different browser.');
    } else {
      setError(`Camera error: ${errorMessage || 'Unknown error'}`);
    }

    toast.error(error || 'Failed to access camera');
  };

  if (!isActive) {
    return (
      <div className="text-center p-4">
        <Button onClick={() => setIsActive(true)} className="w-full">
          <Camera className="mr-2 h-4 w-4" />
          Activate Camera
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
          <Button
            onClick={() => setIsActive(false)}
            variant="outline"
            className="mt-2 w-full"
          >
            Close Camera
          </Button>
        </div>
      ) : (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.9}
            className="w-full rounded-lg"
            videoConstraints={{
              facingMode,
              width: { ideal: 1280, min: 320, max: 1920 },
              height: { ideal: 720, min: 240, max: 1080 },
              frameRate: { ideal: 30, min: 15, max: 60 },
              aspectRatio: { ideal: 16 / 9 },
            }}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
          />
          
          <div className="absolute top-2 right-2">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setIsActive(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button
              onClick={capture}
              size="sm"
              disabled={isCapturing || hasPermission === false}
            >
              {isCapturing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Capturing...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={toggleFacingMode}
              size="sm"
              disabled={isCapturing}
            >
              <Repeat className="mr-2 h-4 w-4" />
              Flip
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
