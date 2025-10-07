'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Questionnaire } from './Questionnaire';
import { useScreeningWna } from '@/hooks/useScreeningWna';
import { apiClient } from '@/lib/api/client';
import { Question, PassportAnalysisResult } from '@/types/screening';
import { Spinner } from '@/components/ui/spinner';
import { PatientFormWna } from '@/app/carstensz/form/PatientFormWna';

export default function ScreeningPage() {
    const router = useRouter();
    const {
        patientData,
        answers,
        isLoading,
        setIsLoading,
        updatePatientData,
        updateAnswer,
        validatePatientData,
    } = useScreeningWna();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [formErrors, setFormErrors] = useState<Record<number, string>>({});

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await apiClient.getQuestionsCarstensz();
            if (response.data && Array.isArray(response.data)) {
                setQuestions(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch questions:', error);
            toast.error('Gagal memuat kuesioner. Silakan refresh halaman.');
        }
    };

    const handlePassportAnalysis = (data: PassportAnalysisResult, file: File) => {
        const parseDateToISO = (dateStr: string) => {
            if (!dateStr) return '';
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
            const match = dateStr.match(/(\d{2})-(\d{2})-(\d{4})/);
            if (match) return `${match[3]}-${match[2]}-${match[1]}`;
            return dateStr;
        };

        updatePatientData('passport_images', file);
        updatePatientData('passport_number', data['Passport Number'] || '');
        updatePatientData('name', data['Full Name'] || '');
        updatePatientData('date_of_birth', parseDateToISO(data['Date of Birth']) || '');
        updatePatientData('gender', data['Gender']?.toLowerCase() || '');
        updatePatientData('nationality', data['Nationality'] || '');
    };



    const validateQuestions = (): boolean => {
        setFormErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePatientData() || !validateQuestions()) return;

        if (!navigator.onLine) {
            toast.error('No internet connection. Please check your connection');
            return;
        }

        setIsLoading(true);
        try {
            const formattedAnswers = Object.keys(answers).map((questionId) => ({
                questioner_id: parseInt(questionId),
                answer: answers[parseInt(questionId)],
            }));

            const formData = new FormData();
            Object.keys(patientData).forEach((key) => {
                const value = patientData[key as keyof typeof patientData];
                if (value !== null && value !== undefined) {
                    if (key === 'passport_images' && value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });
            formData.append('answers', JSON.stringify(formattedAnswers));

            const response = await apiClient.submitScreeningCarstensz(formData);
            if (response.status === 'success' && response.data?.patient?.uuid) {
                const uuid = response.data.patient.uuid;
                router.push(`/carstensz/thanks`);
            } else {
                throw new Error('Patient UUID not found in the response');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Gagal mengirim data. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-3 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Screening Form
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <PatientFormWna
                            data={patientData}
                            onChange={updatePatientData}
                        />
                        <Questionnaire
                            questions={questions}
                            answers={answers}
                            onAnswerChange={updateAnswer}
                            errors={formErrors}
                        />
                        <Button type="submit" className="w-full">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner className="w-5 h-5" />
                                    Please wait
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
