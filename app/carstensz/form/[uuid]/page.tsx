'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { 
    Plus, 
    User, 
    Mail, 
    ArrowLeft 
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Navbar';
import { Spinner } from '@/components/ui/spinner';

export default function SuccessPage() {
    const params = useParams();
    const router = useRouter();
    const uuidParam = params?.uuid;
    const uuid = Array.isArray(uuidParam) ? uuidParam[0] : uuidParam;

    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uuid) return;

        const fetchPatient = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getPatientCarstenszByUUID(uuid);

                if (response.status === 'success') {
                    setPatient(response.data);
                } else {
                    toast.error('Data pasien tidak ditemukan.');
                }
            } catch (error) {
                console.error('Fetch patient error:', error);
                toast.error('Gagal memuat data pasien.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [uuid]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center items-center">
                <div className="flex flex-col items-center space-y-4">
                    <Spinner variant="ellipsis" className="w-12 h-12 text-gray-800" />
                    <p className="text-gray-600 text-lg">Memuat data pasien...</p>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center items-center">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="pt-6 text-center">
                        <p className="text-gray-600">Data pasien tidak tersedia.</p>
                        <Button 
                            onClick={() => router.push('/screening')} 
                            className="mt-4"
                            variant="outline"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Screening
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <Toaster position="top-center" />
            
            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Screening Berhasil
                    </h1>
                    <p className="text-xm">
                        Silakan Datang Sesuai Jadwal Pendakian Anda.
                    </p>
                    
                    <Badge 
                        variant="secondary" 
                        className="mt-4 bg-green-50 text-green-700 border-green-200"
                    >
                        Status: Terdaftar
                    </Badge>
                </div>

                <Separator className="mb-8" />

                {/* Patient Details Card */}
                <Card className="mb-8 shadow-sm">
                    <CardHeader className=" border-b">
                        <CardTitle className="flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Detail Pendaki
                        </CardTitle>
                        <CardDescription>
                            Informasi pendaki yang telah terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-1">
                            {/* Name */}
                            <div className="flex items-center p-4 border rounded-lg ">
                                <User className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Nama Lengkap</p>
                                    <p className="text-lg font-semibold">{patient.name}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center p-4 border rounded-lg ">
                                <Mail className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                                    <p className="text-lg font-semibold">{patient.email}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Button
                        onClick={() => router.push('/screening')}
                        size="lg"
                        className="w-full"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Buat Screening Baru
                    </Button>

                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        size="lg"
                        className="w-full"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Beranda
                    </Button>
                </div>

                {/* Footer Info */}
                <div className="mt-12 pt-8 border-t">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Data telah tersimpan dengan aman. Harp datang dengan jadwal pendakian Anda.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}