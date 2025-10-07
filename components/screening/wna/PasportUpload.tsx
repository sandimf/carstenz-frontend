'use client';

import React, { useRef, useState } from 'react';
import { Upload, CircleCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { PassportAnalysisResult } from '@/types/screening';
import { Spinner } from '@/components/ui/spinner';

interface PassportUploadProps {
  onAnalysisComplete: (data: PassportAnalysisResult, file: File) => void;
  onFileSelect: (file: File) => void;
}

export function PassportUpload({ onAnalysisComplete, onFileSelect }: PassportUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalysisError(null);

    try {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const isValidType = allowedTypes.includes(file.type) || 
        ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(fileExtension || '');

      if (!isValidType) {
        toast.error('File format not supported. Use JPG, PNG, WebP, or HEIC.');
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        toast.error('Maximum file size is 20MB.');
        return;
      }

      let processedFile = file;

      if (file.type.includes('heic') || file.type.includes('heif') || ['heic', 'heif'].includes(fileExtension || '')) {
        const toastId = toast.loading('Converting HEIC format...');
        
        try {
          const result = await apiClient.convertHeic(file);
          const base64Response = await fetch(`data:image/jpeg;base64,${result.data.jpeg_base64}`);
          const blob = await base64Response.blob();
          processedFile = new File([blob], result.data.converted_filename, { type: 'image/jpeg' });
          toast.dismiss(toastId);
          toast.success('HEIC file successfully converted');
        } catch (error: any) {
          toast.dismiss(toastId);
          toast.error('Failed to convert HEIC. Please use JPG or PNG.');
          console.error('HEIC conversion error:', error);
          return;
        }
      }

      setImageFile(processedFile);
      onFileSelect(processedFile);
      await analyzePassport(processedFile);

    } catch (error: any) {
      console.error('File handling error:', error);
      toast.error(error.message || 'Failed to process file');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const analyzePassport = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    const toastId = toast.loading('Analyzing Passport with AI...');

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const result = await apiClient.analyzePassport(file, isMobile);

      if (result.success && result.data) {
        toast.dismiss(toastId);
        toast.success('Passport successfully analyzed! Please review the filled data.');
        onAnalysisComplete(result.data, file);
      } else {
        throw new Error('Analysis result incomplete');
      }

    } catch (error: any) {
      console.error('Passport analysis error:', error);
      toast.dismiss(toastId);
      
      let errorMessage = 'Failed to analyze Passport. Please fill in the data manually.';
      if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message?.includes('network') || error.message?.includes('connection')) {
        errorMessage = 'Connection issue. Please ensure stable internet.';
      }
      
      toast.error(errorMessage, { duration: 5000 });
      setAnalysisError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center w-full">
        <Label
          htmlFor="dropzone-file"
          className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100"
        >
          <div className="flex flex-col justify-center items-center pt-5 pb-6">
            {isAnalyzing ? (
              <>
                <Spinner variant='ellipsis' className="mb-4 w-8 h-8 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Analyzing Passport...</span></p>
              </>
            ) : (
              <>
                <Upload className="mb-4 w-8 h-8 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to Upload</span></p>
                <p className="text-xs text-gray-500">Formats: JPG, PNG, WebP, or HEIC (iPhone)</p>
              </>
            )}
          </div>
          <Input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={isAnalyzing}
          />
        </Label>
      </div>

      {imageFile && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <CircleCheck className="w-4 h-4" />
            Passport file selected: {imageFile.name}
          </p>
        </div>
      )}

      {analysisError && (
        <Alert variant="destructive">
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
