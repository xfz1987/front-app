export enum Gender {
  Male = '男',
  Female = '女',
}

export interface FormData {
  gender: Gender;
  age: number;
  height: number;
  weight: number;
}

export interface AnalysisResponse {
  success: boolean;
  data: {
    userInfo: {
      gender: string;
      age: number;
      height: number;
      weight: number;
    };
    healthAnalysis: {
      status: string;
      isFat: string;
      target: [number, number];
      suggestions: string;
      basis: string;
    };
    dietPlan: {
      breakfast: {
        foods: string[];
        calories: number;
        notes: string;
      };
      lunch: {
        foods: string[];
        calories: number;
        notes: string;
      };
      dinner: {
        foods: string[];
        calories: number;
        notes: string;
      };
    };
    exercisePlan: {
      type: string;
      activities: string[];
      duration: string;
      intensity: string;
      notes: string;
    };
    summary: string;
    generatedAt: string;
    analysisMode: string;
  };
}
