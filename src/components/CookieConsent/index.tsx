import React, { useEffect, useState } from 'react';
import { getCookie, setCookie } from '@helpers/cookie';
import { Button, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './style.module.less';

export const CookieConsent = () => {
	const cookieName = 'skillkit-cookies-policy-agree';
	const router = useRouter();
	const [cookiesAgree, setCookiesAgree] = useState(false);

	useEffect(() => {
		const cookiesPoliceAgree = getCookie(cookieName);
		if (cookiesPoliceAgree === 'true') setCookiesAgree(true);
	}, []);

	useEffect(() => {
		if (cookiesAgree) setCookie(cookieName, 'true');
	}, [cookiesAgree]);

	if (cookiesAgree) {
		return null;
	}

	return (
		<div className={styles.cookiePopup}>
			<div className={styles.data}>
				<div className={styles.content}>
					🍪 This website uses <Link href="/cookies">cookies</Link> to help imrove your user experience
				</div>
				<Space className={styles.buttons}>
					<Button type="primary" size="small" onClick={() => setCookiesAgree(true)}>
						Accept
					</Button>
					<Button size="small" href="/cookies">
						Learn More
					</Button>
				</Space>
			</div>
		</div>
	);
};
