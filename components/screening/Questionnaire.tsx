'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Question, CheckboxTextareaAnswer } from '@/types/screening';

interface QuestionnaireProps {
  questions: Question[];
  answers: Record<number, any>;
  onAnswerChange: (questionId: number, answer: any) => void;
  errors?: Record<number, string>;
}

export function Questionnaire({ questions, answers, onAnswerChange, errors = {} }: QuestionnaireProps) {
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder="Masukkan jawaban Anda"
          />
        );
        case 'textarea':
        return (
          <Textarea
            value={answers[question.id] || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder="Masukkan jawaban Anda"
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={answers[question.id] || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
          />
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={Array.isArray(answers[question.id]) && answers[question.id].includes(option.text)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = Array.isArray(answers[question.id]) ? answers[question.id] : [];
                    
                    // If "Tidak ada dari yang disebutkan" is checked, clear all others
                    if (option.text.includes('Tidak ada') && checked) {
                      onAnswerChange(question.id, [option.text]);
                      return;
                    }
                    
                    const updatedAnswers = checked
                      ? [...currentAnswers.filter((a: string) => !a.includes('Tidak ada')), option.text]
                      : currentAnswers.filter((a: string) => a !== option.text);
                    
                    onAnswerChange(question.id, updatedAnswers);
                  }}
                />
                <span>{option.text}</span>
              </div>
            ))}
          </div>
        );

      case 'checkbox_textarea':
        const currentAnswer = answers[question.id] as CheckboxTextareaAnswer | undefined;
        const selectedOptions = currentAnswer?.options || [];
        const textareaValue = currentAnswer?.textarea || '';

        return (
          <div className="space-y-3">
            <div className="space-y-2">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedOptions.includes(option.text)}
                    onCheckedChange={(checked) => {
                      const newOptions = checked ? [option.text] : [];
                      const newAnswer: CheckboxTextareaAnswer = {
                        options: newOptions,
                        textarea: option.text === 'Ya' ? textareaValue : '',
                      };
                      onAnswerChange(question.id, newAnswer);
                    }}
                  />
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
            
            {selectedOptions.includes('Ya') && (
              <Textarea
                value={textareaValue}
                onChange={(e) => {
                  const newAnswer: CheckboxTextareaAnswer = {
                    options: selectedOptions,
                    textarea: e.target.value,
                  };
                  onAnswerChange(question.id, newAnswer);
                }}
                placeholder="Jelaskan detail..."
                className="mt-2"
              />
            )}
          </div>
        );

      case 'select':
        return (
          <Select
            value={answers[question.id] || ''}
            onValueChange={(value) => onAnswerChange(question.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jawaban" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option) => (
                <SelectItem key={option.id} value={option.text}>
                  {option.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.id} className="rounded-lg p-4">
          <h3 className="mb-3 text-lg font-semibold">{index + 1}. {question.question}</h3>
          <div className="space-y-2">
            {renderQuestion(question)}
            {errors[question.id] && (
              <p className="mt-2 text-sm text-red-500">{errors[question.id]}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}