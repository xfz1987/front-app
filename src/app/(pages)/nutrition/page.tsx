'use client';

import { useState } from 'react';
import { Container, Stack } from '@mui/material';
import { ApolloProvider } from '@apollo/client/react';
import { useMutation } from '@apollo/client/react';
import { apolloClient } from '@/graphql/client';
import {
	FormData,
	AnalysisResponse,
	NutritionGraphQLResponse,
} from './types';
import { ANALYZE_NUTRITION } from '@/graphql/mutations';
import StepIndicator from './components/StepIndicator';
import HealthForm from './components/HealthForm';
import UserInfoCard from './components/UserInfoCard';
import HealthAnalysisCard from './components/HealthAnalysisCard';
import DietPlanCard from './components/DietPlanCard';
import ExercisePlanCard from './components/ExercisePlanCard';
import SummaryCard from './components/SummaryCard';

function NutritionContent() {
	const [step, setStep] = useState<1 | 2>(1);
	const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
		null
	);

	const [analyzeNutrition, { loading }] = useMutation<{
		analyzeNutrition: NutritionGraphQLResponse;
	}>(ANALYZE_NUTRITION);

	const handleFormSubmit = async (formData: FormData) => {
		try {
			const { data } = await analyzeNutrition({
				variables: {
					input: {
						gender: formData.gender,
						age: formData.age,
						height: formData.height,
						weight: formData.weight,
					},
				},
			});

			if (data?.analyzeNutrition?.success && data.analyzeNutrition.data) {
				// 解析 data 字符串为 JSON 对象
				const parsedData = JSON.parse(data.analyzeNutrition.data);
				setAnalysisResult({
					success: data.analyzeNutrition.success,
					data: parsedData,
				});
				setStep(2);
			} else {
				const errorMessage =
					data?.analyzeNutrition?.error ||
					data?.analyzeNutrition?.message ||
					'分析失败,请重试';
				alert(errorMessage);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('网络错误,请稍后重试');
		}
	};

	const handleReset = () => {
		setStep(1);
		setAnalysisResult(null);
	};

	return (
		<Container maxWidth='lg'>
			<StepIndicator currentStep={step} />

			{step === 1 && (
				<HealthForm onSubmit={handleFormSubmit} loading={loading} />
			)}

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

export default function NutritionPage() {
	return (
		<ApolloProvider client={apolloClient}>
			<NutritionContent />
		</ApolloProvider>
	);
}
