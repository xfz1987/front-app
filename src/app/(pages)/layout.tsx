'use client';
// import dynamic from 'next/dynamic';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
// import ThemeProvider from '@/app/components/themeProvider';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// const NoSSR = dynamic(() => import('@/app/components/themeProvider'), {
// 	ssr: false,
// });

export default function PagesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// <NoSSR>
		<DashboardLayout>{children}</DashboardLayout>
		// </NoSSR>
	);
}
