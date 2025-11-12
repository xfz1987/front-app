'use client';

import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const drawerWidth = 240;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<Box sx={{ display: 'flex', minHeight: '100vh' }}>
			{/* 左侧导航栏 */}
			<Sidebar />

			{/* 右侧内容区域 */}
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					width: `calc(100% - ${drawerWidth}px)`,
					bgcolor: 'grey.50',
				}}
			>
				{/* 顶部导航栏 */}
				<Topbar />
				{/* 主内容区域 */}
				<Toolbar /> {/* 占位符,避免内容被顶部导航栏遮挡 */}
				<Box sx={{ p: 3 }}>{children}</Box>
			</Box>
		</Box>
	);
}
