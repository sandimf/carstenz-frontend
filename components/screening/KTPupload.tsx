'use client';

import React, { useRef, useState } from 'react';
import { Upload, CircleCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { KTPAnalysisResult } from '@/types/screening';
import { Spinner } from '@/components/ui/spinner';

interface KTPUploadProps {
  onAnalysisComplete: (data: KTPAnalysisResult, file: File) => void;
  onFileSelect: (file: File) => void;
}

export function KTPUpload({ onAnalysisComplete, onFileSelect }: KTPUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalysisError(null);

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const isValidType = allowedTypes.includes(file.type) || 
        ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(fileExtension || '');

      if (!isValidType) {
        toast.error('Format file tidak didukung. Gunakan JPG, PNG, WebP, atau HEIC.');
        return;
      }

      // Validate file size (20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 20MB');
        return;
      }

      let processedFile = file;

      // Convert HEIC if needed
      if (file.type.includes('heic') || file.type.includes('heif') || 
          ['heic', 'heif'].includes(fileExtension || '')) {
        const toastId = toast.loading('Mengkonversi format HEIC...');
        
        try {
          const result = await apiClient.convertHeic(file);
          
          // Convert base64 to File
          const base64Response = await fetch(`data:image/jpeg;base64,${result.data.jpeg_base64}`);
          const blob = await base64Response.blob();
          processedFile = new File([blob], result.data.converted_filename, { type: 'image/jpeg' });
          
          toast.dismiss(toastId);
          toast.success('File HEIC berhasil dikonversi');
        } catch (error: any) {
          toast.dismiss(toastId);
          toast.error('Gagal mengkonversi HEIC. Silakan gunakan format JPG atau PNG.');
          console.error('HEIC conversion error:', error);
          return;
        }
      }

      setImageFile(processedFile);
      onFileSelect(processedFile);

      // Analyze with AI
      await analyzeKTP(processedFile);

    } catch (error: any) {
      console.error('File handling error:', error);
      toast.error(error.message || 'Gagal memproses file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const analyzeKTP = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    const toastId = toast.loading('Menganalisis KTP dengan AI...');

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const result = await apiClient.analyzeKTP(file, isMobile);

      if (result.success && result.data) {
        toast.dismiss(toastId);
        toast.success('KTP berhasil dianalisis! Silakan cek data yang terisi.');
        onAnalysisComplete(result.data, file);
      } else {
        throw new Error('Hasil analisis tidak lengkap');
      }

    } catch (error: any) {
      console.error('KTP analysis error:', error);
      toast.dismiss(toastId);
      
      let errorMessage = 'Gagal menganalisis KTP. Silakan isi data secara manual.';
      
      if (error.response?.status === 429) {
        errorMessage = 'Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.';
      } else if (error.message?.includes('network') || error.message?.includes('connection')) {
        errorMessage = 'Koneksi bermasalah. Pastikan internet stabil.';
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
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Menganalisis KTP...</span>
                </p>
              </>
            ) : (
              <>
                <Upload className="mb-4 w-8 h-8 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Klik untuk Unggah</span>
                </p>
                <p className="text-xs text-gray-500">
                  Format: JPG, PNG, WebP, atau HEIC (iPhone)
                </p>
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
            File KTP berhasil dipilih: {imageFile.name}
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