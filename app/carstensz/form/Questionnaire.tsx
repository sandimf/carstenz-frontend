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
            placeholder="Enter your answer"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={answers[question.id] || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={answers[question.id] || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer"
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
                    if (option.text.includes('None of the above') && checked) {
                      onAnswerChange(question.id, [option.text]);
                      return;
                    }
                    
                    const updatedAnswers = checked
                      ? [...currentAnswers.filter((a: string) => !a.includes('None of the above')), option.text]
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
                        textarea: option.text === 'Drug allergies' ? textareaValue : '',
                      };
                      onAnswerChange(question.id, newAnswer);
                    }}
                  />
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
            
            {selectedOptions.includes('Drug allergies') && (
              <Textarea
                value={textareaValue}
                onChange={(e) => {
                  const newAnswer: CheckboxTextareaAnswer = {
                    options: selectedOptions,
                    textarea: e.target.value,
                  };
                  onAnswerChange(question.id, newAnswer);
                }}
                placeholder="Please provide details..."
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
              <SelectValue placeholder="Select an answer" />
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
    {questions.map((question, index) => {
      // tampilkan section hanya jika ada dan berbeda dari sebelumnya
      const prevSection = index > 0 ? questions[index - 1].section : null;
      const showSection = question.section && question.section !== prevSection;

      return (
        <div key={question.id} className="rounded-lg p-4 ">
          {showSection && (
            <h2 className="text-xl font-bold mb-2">{question.section}</h2>
          )}
          <h3 className="mb-3 text-lg font-semibold">{question.question}</h3>
          <div className="space-y-2">
            {renderQuestion(question)}
            {errors[question.id] && (
              <p className="mt-2 text-sm text-red-500">{errors[question.id]}</p>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

}
