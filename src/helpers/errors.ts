import { CombinedError } from 'urql';

export const getErrorMessage = (error: CombinedError) => {
	if (error.graphQLErrors.length) {
		return error.graphQLErrors[0].message;
	}

	if (error.networkError) {
		return error.networkError.message;
	}

	return 'Unknown error';
};
