/* eslint-disable react/no-unescaped-entities */
import { Button } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BsArrowLeftShort } from 'react-icons/bs';
import styles from './style.module.less';

const CookiesPage = () => {
	const router = useRouter();

	return (
		<div className={styles.article}>
			<Head>
				<title>Cookies Policy - Skillkit</title>
				<meta name="description" content="Policy for using cookies files" />
				<meta property="og:title" content="Cookies Policy - Skillkit" key="og:title" />
				<meta property="og:type" content="article" />
				<meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL + router.route} />
				<meta name="twitter:title" content="Cookies Policy - Skillkit" />
				<meta name="twitter:description" content="Policy for using cookies files" />
				<meta key="robots" name="robots" content="noindex,follow" />
				<meta key="googlebot" name="googlebot" content="noindex,follow" />
			</Head>
			<div className={styles.beforePost}>
				<Button href="/" type="primary" size="small">
					<BsArrowLeftShort size={24} />
					go to home
				</Button>
			</div>
			<h1>Policy for using cookies files</h1>
			<p>Effective date: June 17, 2022</p>
			<p>
				I am («Dzmitry Drynau») take the protection of your personal data very seriously. This Privacy Policy establishes
				the obligations of the Website owner (Aiscom LLC) on non-disclosure and ensuring the protection of the
				confidentiality of the personal data that you provide. We are committed ourselves to protecting and respecting your
				rights to protect your personal data. One of the principles of our work with personal data is the integrity of your
				personal information. We undertake to ensure the keeping your confidential information in secret, to prevent its
				disclosure without your prior written permission, and not to sell, exchange, publish or disclose in any other
				possible way your personal data, unless we are obliged to do so by virtue of an act of law.
			</p>
			<p>
				This Policy is designed to inform you how Dzmitry Drynau uses cookies files in the Website. Please, read carefully
				this Policy before using the Website. &nbsp;
			</p>
			<p>&nbsp;</p>
			<h3>Definitions</h3>
			<p>
				“Website” is www.skillkit.me or any other website or information resource owned by Dzmitry Drynau, which refers to
				this Privacy Policy.
			</p>
			<p>
				“Website user” (“user”, “you”) is a natural person or a representative of a legal entity, which has full legal
				capacity and ability to use the website to receive or provide information related to services Dzmitry Drynau.
			</p>
			<p>&nbsp;</p>
			<h3>WHAT DO COOKIES FILES MEAN?</h3>
			<p>
				Cookie is a technology that allows a website to store information about your website activity in your browser, which
				is used by the website while you are using it. Cookies are small text files stored on your computer or other device.
				These files often consist of data in the form of a chain of numbers and letters, which, for example, identifies your
				computer or contains other information. The use of cookies is currently the standard practice for most websites.
				Most browsers allow you to view and manage cookies, as well as refuse to receive cookies and delete them from the
				device’s hard disk.
			</p>
			<p>
				If you disable or refuse cookies, some parts of the Dzmitry Drynau website may become inaccessible or malfunction.
				For more information about the cookies that Dzmitry Drynau uses, please, see the Dzmitry Drynau Cookie Policy.
			</p>
			<p>&nbsp;</p>
			<h3>USER&apos;S CONSENT TO USE OF COOKIES</h3>
			<p>
				You have been informed and agree that your consent given in electronic form on the Site is a consent that fully
				meets the requirements of the law. By clicking the "I agree" button on the Site, you give Dzmitry Drynau consent to
				the use of cookies when you use the Site. If you do not agree with the terms of this Policy, do not click the "I
				Agree" button.
			</p>
			<p>
				If you disable or refuse cookies, some parts of the Dzmitry Drynau Websites may become inaccessible or malfunction.
			</p>
			<p>&nbsp;</p>
			<h3>DATA PROCESSING PROCEDURE WHEN USING COOKIES</h3>
			<p>
				Dzmitry Drynau automatically processes your technical information, such as IP address, device type, unique device
				identification number, browser type, access time, referrer (address of the previous page), geographic location, etc.
			</p>
			<p>&nbsp;</p>
			<h3>CONTACT INFORMATION</h3>
			<p>
				If you have any questions or suggestions regarding this Policy or you would like to contact us with a request or
				complaint regarding the processing of your personal data, please send us an email at info@skillkit.me.com. Address:
				11 Kulman str., 6th floor, Minsk city, 220100, The Republic of Belarus, self project.
			</p>
		</div>
	);
};

export default CookiesPage;
