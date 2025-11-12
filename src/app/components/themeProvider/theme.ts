import { createTheme } from '@mui/material/styles';

// 浅色主题（默认）
export const lightTheme = createTheme({
	palette: {
		mode: 'light', // 浅色模式
		primary: { main: '#1976d2' }, // 自定义主色调
	},
});

// 深色主题
export const darkTheme = createTheme({
	palette: {
		mode: 'dark', // 深色模式
		primary: { main: '#90caf9' }, // 深色模式下的主色调（可选）
	},
});
