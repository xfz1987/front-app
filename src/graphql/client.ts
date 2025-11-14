import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// GraphQL 端点 URL
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

const httpLink = createHttpLink({
	uri: GRAPHQL_ENDPOINT,
	credentials: 'omit',
	headers: {
		'Content-Type': 'application/json',
	},
});

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'network-only',
		},
	},
});
