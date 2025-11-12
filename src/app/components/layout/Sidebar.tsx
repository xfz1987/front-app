'use client';

import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Box,
	Typography,
	Divider,
	Toolbar,
} from '@mui/material';
import {
	Restaurant,
	Dashboard as DashboardIcon,
	BarChart,
	People,
	Settings,
	Home,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidth = 240;

interface MenuItem {
	text: string;
	icon: React.ReactNode;
	path: string;
}

const menuItems: MenuItem[] = [
	// {
	// 	text: 'Home',
	// 	icon: <Home />,
	// 	path: '/',
	// },
	{
		text: '健康分析',
		icon: <Restaurant />,
		path: '/nutrition',
	},
];

const bottomMenuItems: MenuItem[] = [
	{
		text: 'Settings',
		icon: <Settings />,
		path: '/settings',
	},
];

export default function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();

	const handleNavigation = (path: string) => {
		router.push(path);
	};

	return (
		<Drawer
			variant='permanent'
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
					borderRight: '1px solid',
					borderColor: 'divider',
					bgcolor: 'background.default',
				},
			}}
		>
			<Toolbar>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Box
						sx={{
							width: 32,
							height: 32,
							borderRadius: 1,
							bgcolor: 'primary.main',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'white',
							fontWeight: 'bold',
						}}
					>
						A
					</Box>
					<Typography variant='h6' fontWeight='bold' color='primary'>
						Platform
					</Typography>
				</Box>
			</Toolbar>

			<Divider />

			<Box
				sx={{
					overflow: 'auto',
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				<List>
					{menuItems.map((item) => {
						const isActive = pathname === item.path;
						return (
							<ListItem key={item.text} disablePadding>
								<ListItemButton
									selected={isActive}
									onClick={() => handleNavigation(item.path)}
									sx={{
										'&.Mui-selected': {
											bgcolor: 'primary.main',
											color: 'white',
											'&:hover': {
												bgcolor: 'primary.dark',
											},
											'& .MuiListItemIcon-root': {
												color: 'white',
											},
										},
									}}
								>
									<ListItemIcon
										sx={{
											color: isActive ? 'white' : 'text.secondary',
											minWidth: 40,
										}}
									>
										{item.icon}
									</ListItemIcon>
									<ListItemText
										primary={item.text}
										primaryTypographyProps={{
											fontSize: '0.9rem',
											fontWeight: isActive ? 600 : 400,
										}}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>

				<Box sx={{ flexGrow: 1 }} />

				<Divider />

				<List>
					{bottomMenuItems.map((item) => {
						const isActive = pathname === item.path;
						return (
							<ListItem key={item.text} disablePadding>
								<ListItemButton
									selected={isActive}
									onClick={() => handleNavigation(item.path)}
									sx={{
										'&.Mui-selected': {
											bgcolor: 'primary.main',
											color: 'white',
											'&:hover': {
												bgcolor: 'primary.dark',
											},
											'& .MuiListItemIcon-root': {
												color: 'white',
											},
										},
									}}
								>
									<ListItemIcon
										sx={{
											color: isActive ? 'white' : 'text.secondary',
											minWidth: 40,
										}}
									>
										{item.icon}
									</ListItemIcon>
									<ListItemText
										primary={item.text}
										primaryTypographyProps={{
											fontSize: '0.9rem',
											fontWeight: isActive ? 600 : 400,
										}}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
			</Box>
		</Drawer>
	);
}
