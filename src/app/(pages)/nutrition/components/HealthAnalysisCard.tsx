import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  FitnessCenter,
  Lightbulb,
  Description,
} from '@mui/icons-material';
import { AnalysisResponse } from '../types';

interface HealthAnalysisCardProps {
  data: AnalysisResponse['data'];
}

const getHealthStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case '0':
      return 'success';
    case '1':
      return 'warning';
    case '2':
      return 'error';
    default:
      return 'default';
  }
};

const getHealthStatusText = (status: string) => {
  switch (status) {
    case '0':
      return '健康';
    case '1':
      return '偏轻/偏重';
    case '2':
      return '需注意';
    default:
      return '未知';
  }
};

const getHealthStatusIcon = (status: string) => {
  switch (status) {
    case '0':
      return <CheckCircle />;
    case '1':
      return <Warning />;
    case '2':
      return <ErrorIcon />;
    default:
      return <CheckCircle />;
  }
};

export default function HealthAnalysisCard({ data }: HealthAnalysisCardProps) {
  const { healthAnalysis } = data;

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          健康分析
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 健康状态 */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                健康状态
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip
                  icon={getHealthStatusIcon(healthAnalysis.status)}
                  label={getHealthStatusText(healthAnalysis.status)}
                  color={getHealthStatusColor(healthAnalysis.status)}
                  sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2.5 }}
                />
              </Box>
            </Box>
            <Box sx={{ fontSize: '3rem' }}>
              {healthAnalysis.status === '0' ? '✅' : '⚠️'}
            </Box>
          </Box>

          {/* 目标体重范围 */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'grey.50',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <FitnessCenter sx={{ color: 'primary.main', fontSize: 40 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                目标体重范围
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {healthAnalysis.target[0]} - {healthAnalysis.target[1]} kg
              </Typography>
            </Box>
          </Box>

          {/* 建议 */}
          <Alert
            icon={<Lightbulb />}
            severity="info"
            sx={{
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              建议
            </Typography>
            <Typography variant="body2">{healthAnalysis.suggestions}</Typography>
          </Alert>

          {/* 分析依据 */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'blue.50',
              border: '1px solid',
              borderColor: 'blue.200',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Description sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle2" fontWeight="bold">
                分析依据
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'text.secondary' }}>
              {healthAnalysis.basis}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
