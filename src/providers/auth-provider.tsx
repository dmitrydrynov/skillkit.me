import { FC, useEffect, useState } from 'react';
import { getCookie, setCookie } from '@helpers/cookie';
import { gtmEvent } from '@helpers/gtm';
import { authenticatedUserQuery, signInByCodeQuery } from '@services/graphql/queries/auth';
import { RootState } from '@store/configure-store';
import { setLogin, setLoginingIn } from '@store/reducers/auth';
import { setUserData } from '@store/reducers/user';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'urql';

export const AuthProvider: FC = ({ children }): any => {
	const dispatch = useDispatch();
	const { query: queryParams, push: routerPush } = useRouter();
	const [sessionToken, setSessionToken] = useState<string | null>(null);
	const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
	const [userDataByCode] = useQuery({
		query: signInByCodeQuery,
		variables: { code: queryParams.code, state: queryParams.state, serviceName: 'discord' },
		pause: !queryParams?.code,
	});
	const [userData] = useQuery({
		query: authenticatedUserQuery,
		pause: !sessionToken && !loggedIn,
	});

	// If user already logged in set token
	useEffect(() => {
		if (process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME) {
			const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);
			setSessionToken(token);
		}
	}, []);

	// If user on login process set loggining
	useEffect(() => {
		if (!!userData || !!userDataByCode) {
			dispatch(setLoginingIn(userData?.fetching || userDataByCode?.fetching));
		}
	}, [userData, userDataByCode]);

	// If user logged in through code variable set token
	useEffect(() => {
		if (userDataByCode.data) {
			const { token } = userDataByCode.data.signInByCode;

			if (token) {
				setSessionToken(token);
				setCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME, token);
				gtmEvent('LoginEvent');
			}
		}
	}, [userDataByCode]);

	// If user logged in set init user data and redirect to user skills page
	useEffect(() => {
		const data = userData?.data?.authenticatedUser || userDataByCode?.data?.signInByCode;

		if (data && sessionToken) {
			dispatch(setLogin());
			dispatch(setUserData(data));

			if (userDataByCode?.data?.signInByCode) {
				routerPush('/user/skills');
			}
		}
	}, [sessionToken, userData, userDataByCode]);

	return children;
};
