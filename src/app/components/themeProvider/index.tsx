'use client'; // 标记为客户端组件

import { useState, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';

export default function ThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// 初始化：优先读取 localStorage，其次跟随系统
	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		if (typeof window === 'undefined') return false; // 服务端默认浅色
		const saved = localStorage.getItem('darkMode');
		if (saved !== null) return JSON.parse(saved);
		// 跟随系统设置
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	// 保存偏好到 localStorage
	useEffect(() => {
		localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
	}, [isDarkMode]);

	// 切换主题
	const toggleTheme = () => setIsDarkMode(!isDarkMode);

	return (
		<MUIThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
			<CssBaseline /> {/* 重置样式，确保主题生效 */}
			{/* 传递 toggleTheme 给子组件（如需切换按钮） */}
			<div style={{ display: 'contents' }}>{children}</div>
		</MUIThemeProvider>
	);
}
