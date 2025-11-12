import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  Person,
  Cake,
  Height,
  FitnessCenter,
} from '@mui/icons-material';
import { AnalysisResponse } from '../types';

interface UserInfoCardProps {
  data: AnalysisResponse['data'];
}

export default function UserInfoCard({ data }: UserInfoCardProps) {
  const { userInfo } = data;

  const infoItems = [
    {
      icon: <Person />,
      label: '性别',
      value: userInfo.gender,
      color: userInfo.gender === '男' ? '#1976d2' : '#ec4899',
    },
    {
      icon: <Cake />,
      label: '年龄',
      value: `${userInfo.age} 岁`,
      color: '#2196f3',
    },
    {
      icon: <Height />,
      label: '身高',
      value: `${userInfo.height} cm`,
      color: '#9c27b0',
    },
    {
      icon: <FitnessCenter />,
      label: '体重',
      value: `${userInfo.weight} kg`,
      color: '#ff9800',
    },
  ];

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          基本信息
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            },
            gap: 2,
            mt: 2,
          }}
        >
          {infoItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                bgcolor: 'grey.50',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box
                sx={{
                  color: item.color,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {item.label}
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
