export const configSEO = {
	title: 'Skillkit — flexible alternative to the classic resume',
	description: 'Build your unique skills and share them with customers and employers.',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: process.env.NEXT_PUBLIC_APP_URL,
		site_name: 'Skillkit — flexible alternative to the classic resume',
		image: `${process.env.NEXT_PUBLIC_APP_URL}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvolunteer-illustration.ff9f1da2.png&w=1080&q=75`,
	},
	twitter: {
		cardType: 'summary_large_image',
	},
};
