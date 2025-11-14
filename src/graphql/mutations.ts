import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
	mutation SendMessage($message: String!) {
		chat(message: $message) {
			message
			timestamp
		}
	}
`;

export const ANALYZE_NUTRITION = gql`
	mutation AnalyzeNutrition($input: NutritionInput!) {
		analyzeNutrition(input: $input) {
			success
			data
			error
			message
		}
	}
`;
