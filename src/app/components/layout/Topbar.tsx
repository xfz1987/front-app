'use client';

import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Box,
	Badge,
	Avatar,
	Menu,
	MenuItem,
	Divider,
} from '@mui/material';
import {
	Search as SearchIcon,
	Notifications as NotificationsIcon,
	Email as EmailIcon,
	AccountCircle,
	Settings,
	Logout,
} from '@mui/icons-material';
import { useState } from 'react';

const drawerWidth = 240;

export default function Topbar() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<AppBar
			position='fixed'
			sx={{
				width: `calc(100% - ${drawerWidth}px)`,
				ml: `${drawerWidth}px`,
				bgcolor: 'white',
				color: 'text.primary',
				boxShadow: 1,
			}}
		>
			<Toolbar>
				<Box sx={{ flexGrow: 1 }} />

				{/* 右侧图标 */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{/* 消息通知 */}
					<Divider orientation='vertical' flexItem sx={{ mx: 1 }} />

					{/* 用户头像和菜单 */}
					<IconButton onClick={handleProfileMenuOpen}>
						<Avatar
							sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
						></Avatar>
					</IconButton>

					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleProfileMenuClose}
						sx={{ mt: 1 }}
					>
						<Box sx={{ px: 2, py: 1 }}>
							<Typography variant='subtitle2' fontWeight='bold'>
								Alexander Pierce
							</Typography>
							<Typography variant='caption' color='text.secondary'>
								alexander@example.com
							</Typography>
						</Box>
						<Divider />
						<MenuItem onClick={handleProfileMenuClose}>
							<AccountCircle sx={{ mr: 1 }} fontSize='small' />
							Profile
						</MenuItem>
						<MenuItem onClick={handleProfileMenuClose}>
							<Settings sx={{ mr: 1 }} fontSize='small' />
							Settings
						</MenuItem>
						<Divider />
						<MenuItem onClick={handleProfileMenuClose}>
							<Logout sx={{ mr: 1 }} fontSize='small' />
							Logout
						</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
