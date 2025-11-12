'use client';

import { useState } from 'react';
import { Container, Stack } from '@mui/material';
import { FormData, AnalysisResponse } from './types';
import StepIndicator from './components/StepIndicator';
import HealthForm from './components/HealthForm';
import UserInfoCard from './components/UserInfoCard';
import HealthAnalysisCard from './components/HealthAnalysisCard';
import DietPlanCard from './components/DietPlanCard';
import ExercisePlanCard from './components/ExercisePlanCard';
import SummaryCard from './components/SummaryCard';

export default function NutritionPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  const handleFormSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const response = await fetch('https://api2.yideng.shop/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gender: formData.gender,
          age: formData.age,
          height: formData.height,
          weight: formData.weight,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data);
        setStep(2);
      } else {
        alert('分析失败,请重试');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('网络错误,请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnalysisResult(null);
  };

  return (
    <Container maxWidth="lg">
      <StepIndicator currentStep={step} />

      {step === 1 && <HealthForm onSubmit={handleFormSubmit} loading={loading} />}

      {step === 2 && analysisResult && (
        <Stack spacing={3}>
          <UserInfoCard data={analysisResult.data} />
          <HealthAnalysisCard data={analysisResult.data} />
          <DietPlanCard data={analysisResult.data} />
          <ExercisePlanCard data={analysisResult.data} />
          <SummaryCard data={analysisResult.data} onReset={handleReset} />
        </Stack>
      )}
    </Container>
  );
}
