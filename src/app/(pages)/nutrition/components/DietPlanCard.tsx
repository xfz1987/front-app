import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Restaurant,
  WbSunny,
  LightMode,
  NightsStay,
} from '@mui/icons-material';
import { AnalysisResponse } from '../types';

interface DietPlanCardProps {
  data: AnalysisResponse['data'];
}

interface MealSectionProps {
  title: string;
  icon: React.ReactNode;
  foods: string[];
  calories: number;
  notes: string;
  bgColor: string;
  chipColor: 'warning' | 'success' | 'secondary';
}

function MealSection({ title, icon, foods, calories, notes, bgColor, chipColor }: MealSectionProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        background: bgColor,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Chip
          label={`${calories} 卡路里`}
          color={chipColor}
          sx={{ fontWeight: 'bold' }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 2,
        }}
      >
        {foods.map((food, index) => (
          <Chip
            key={index}
            label={food}
            size="small"
            sx={{
              bgcolor: 'white',
              fontWeight: 500,
            }}
          />
        ))}
      </Box>

      <Typography variant="body2" color="text.secondary">
        {notes}
      </Typography>
    </Box>
  );
}

export default function DietPlanCard({ data }: DietPlanCardProps) {
  const { dietPlan } = data;

  const meals = [
    {
      title: '早餐',
      icon: <WbSunny sx={{ color: '#f57c00' }} />,
      foods: dietPlan.breakfast.foods,
      calories: dietPlan.breakfast.calories,
      notes: dietPlan.breakfast.notes,
      bgColor: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
      chipColor: 'warning' as const,
    },
    {
      title: '午餐',
      icon: <LightMode sx={{ color: '#388e3c' }} />,
      foods: dietPlan.lunch.foods,
      calories: dietPlan.lunch.calories,
      notes: dietPlan.lunch.notes,
      bgColor: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      chipColor: 'success' as const,
    },
    {
      title: '晚餐',
      icon: <NightsStay sx={{ color: '#7b1fa2' }} />,
      foods: dietPlan.dinner.foods,
      calories: dietPlan.dinner.calories,
      notes: dietPlan.dinner.notes,
      bgColor: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
      chipColor: 'secondary' as const,
    },
  ];

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Restaurant color="primary" />
          <Typography variant="h6" fontWeight="bold">
            饮食计划
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {meals.map((meal, index) => (
            <MealSection key={index} {...meal} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
