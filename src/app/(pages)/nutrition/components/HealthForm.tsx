"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Male, Female } from "@mui/icons-material";
import { FormData, Gender } from "../types";

const formSchema = z.object({
  gender: z.enum(Gender, { message: "请选择性别" }),
  age: z
    .number("请输入有效的数字")
    .min(1, "年龄必须大于0")
    .max(150, "年龄不能超过150"),
  height: z
    .number("请输入有效的数字")
    .min(50, "身高不能低于50cm")
    .max(250, "身高不能超过250cm"),
  weight: z
    .number("请输入有效的数字")
    .min(20, "体重不能低于20kg")
    .max(300, "体重不能超过300kg"),
});

interface HealthFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

export default function HealthForm({ onSubmit, loading }: HealthFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: undefined,
      age: undefined,
      height: undefined,
      weight: undefined,
    },
  });

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: "auto",
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            健康分析评估
          </Typography>
          <Typography variant="body2" color="text.secondary">
            填写您的基本信息,获取专业的健康建议
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* 性别选择 */}
            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                性别{" "}
                <Box component="span" color="error.main">
                  *
                </Box>
              </Typography>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    {...field}
                    exclusive
                    fullWidth
                    color="primary"
                    sx={{ mt: 1 }}
                  >
                    <ToggleButton value={Gender.Male}>
                      <Male sx={{ mr: 1 }} />
                      男性
                    </ToggleButton>
                    <ToggleButton value={Gender.Female}>
                      <Female sx={{ mr: 1 }} />
                      女性
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
              {errors.gender && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {errors.gender.message}
                </Typography>
              )}
            </Box>

            {/* 年龄输入 */}
            <Controller
              name="age"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  label="年龄"
                  type="number"
                  fullWidth
                  required
                  value={value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === "" ? undefined : Number(val));
                  }}
                  error={!!errors.age}
                  helperText={errors.age?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <Typography color="text.secondary">岁</Typography>
                      ),
                    },
                  }}
                />
              )}
            />

            {/* 身高输入 */}
            <Controller
              name="height"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  label="身高"
                  type="number"
                  fullWidth
                  required
                  value={value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === "" ? undefined : Number(val));
                  }}
                  error={!!errors.height}
                  helperText={errors.height?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <Typography color="text.secondary">cm</Typography>
                      ),
                    },
                    htmlInput: {
                      step: 0.1,
                    },
                  }}
                />
              )}
            />

            {/* 体重输入 */}
            <Controller
              name="weight"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  label="体重"
                  type="number"
                  fullWidth
                  required
                  value={value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === "" ? undefined : Number(val));
                  }}
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <Typography color="text.secondary">kg</Typography>
                      ),
                    },
                    htmlInput: {
                      step: 0.1,
                    },
                  }}
                />
              )}
            />

            {/* 提交按钮 */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  分析中...
                </>
              ) : (
                "开始分析"
              )}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
