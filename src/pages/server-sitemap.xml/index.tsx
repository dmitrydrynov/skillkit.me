import { GetServerSideProps } from 'next';
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	// Method to source urls from cms
	// const urls = await fetch('https//example.com/api')

	const fields = [
		{
			loc: process.env.NEXT_PUBLIC_APP_URL, // Absolute url
			lastmod: new Date().toISOString(),
			// changefreq
			// priority
		},
	];

	return await getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
