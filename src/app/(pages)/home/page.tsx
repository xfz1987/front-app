'use client';

import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/graphql/client';
import ChatBox from '@/app/components/chatbox';

export default function HomePage() {
	return (
		<ApolloProvider client={apolloClient}>
			<ChatBox />;
		</ApolloProvider>
	);
}
