import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material';
import {
  AutoAwesome,
  Refresh,
  CalendarToday,
  Settings,
} from '@mui/icons-material';
import { AnalysisResponse } from '../types';

interface SummaryCardProps {
  data: AnalysisResponse['data'];
  onReset: () => void;
}

export default function SummaryCard({ data, onReset }: SummaryCardProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 总结卡片 */}
      <Card
        sx={{
          boxShadow: 3,
          background: 'linear-gradient(135deg, #5e35b1 0%, #7e57c2 100%)',
          color: 'white',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AutoAwesome />
            <Typography variant="h6" fontWeight="bold">
              健康建议总结
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              mb: 3,
              opacity: 0.95,
            }}
          >
            {data.summary}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              gap: 1,
              fontSize: '0.875rem',
              opacity: 0.9,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Settings sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                分析模式：{data.analysisMode}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                生成时间：{new Date(data.generatedAt).toLocaleString('zh-CN')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 重新分析按钮 */}
      <Button
        variant="outlined"
        size="large"
        fullWidth
        onClick={onReset}
        startIcon={<Refresh />}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 'bold',
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
          transition: 'all 0.3s',
        }}
      >
        重新分析
      </Button>
    </Box>
  );
}
