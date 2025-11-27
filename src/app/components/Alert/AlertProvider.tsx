'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';

// Alert 的内部状态
interface AlertState {
	open: boolean;
	message: string;
	severity: AlertColor;
}

// Context 对外暴露的方法
interface AlertContextValue {
	showAlert: (message: string, severity?: AlertColor) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
	const [alert, setAlert] = useState<AlertState>({
		open: false,
		message: '',
		severity: 'info',
	});

	const showAlert: AlertContextValue['showAlert'] = (
		message,
		severity = 'info'
	) => {
		setAlert({
			open: true,
			message,
			severity,
		});
	};

	const handleClose = () => {
		setAlert((prev) => ({ ...prev, open: false }));
	};

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{children}

			<Snackbar
				open={alert.open}
				autoHideDuration={3000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert severity={alert.severity} onClose={handleClose}>
					{alert.message}
				</Alert>
			</Snackbar>
		</AlertContext.Provider>
	);
}

export function useAlert(): AlertContextValue {
	const ctx = useContext(AlertContext);
	if (!ctx) {
		throw new Error('useAlert must be used inside <AlertProvider>');
	}
	return ctx;
}
