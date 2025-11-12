import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import {
  FitnessCenter,
  DirectionsRun,
  AccessTime,
  Speed,
  Info,
} from '@mui/icons-material';
import { AnalysisResponse } from '../types';

interface ExercisePlanCardProps {
  data: AnalysisResponse['data'];
}

export default function ExercisePlanCard({ data }: ExercisePlanCardProps) {
  const { exercisePlan } = data;

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FitnessCenter color="primary" />
          <Typography variant="h6" fontWeight="bold">
            运动计划
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 运动类型 */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'blue.50',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <DirectionsRun sx={{ color: 'primary.main', fontSize: 40 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                运动类型
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {exercisePlan.type}
              </Typography>
            </Box>
          </Box>

          {/* 运动时长和强度 */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              },
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'green.50',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <AccessTime sx={{ color: 'success.main', fontSize: 32 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  运动时长
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {exercisePlan.duration}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'orange.50',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Speed sx={{ color: 'warning.main', fontSize: 32 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  运动强度
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {exercisePlan.intensity}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 推荐活动 */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'purple.50',
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              推荐活动
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 1.5,
              }}
            >
              {exercisePlan.activities.map((activity, index) => (
                <Chip
                  key={index}
                  label={activity}
                  sx={{
                    bgcolor: 'white',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 温馨提示 */}
          <Alert
            icon={<Info />}
            severity="warning"
            sx={{
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              温馨提示
            </Typography>
            <Typography variant="body2">{exercisePlan.notes}</Typography>
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
}
