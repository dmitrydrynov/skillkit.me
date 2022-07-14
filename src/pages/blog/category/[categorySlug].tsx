import { ssrGraphqlClient } from '@services/graphql/client';
import { getPostCategoryQuery } from '@services/graphql/queries/postCategory';
import Head from 'next/head';

const BlogCategoryPage = ({ data: category }) => {
	return (
		<>
			<Head>
				<title>{category.name}</title>
			</Head>
			<p>{category.name}</p>
		</>
	);
};

export async function getServerSideProps(context) {
	const { categorySlug } = context.query;
	let categoryData: any = {};
	let description: string = 'Category of the Skillkit Blog';

	if (categorySlug) {
		const client = ssrGraphqlClient(context.req.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME]);

		const { data, error } = await client
			.query(getPostCategoryQuery, {
				where: { slug: { equals: categorySlug } },
			})
			.toPromise();

		if (error) {
			console.error(error);
			return { notFound: true };
		}

		categoryData = data?.postCategory;
	}

	return {
		props: {
			data: categoryData,
			meta: {
				description,
				url: process.env.NEXT_PUBLIC_APP_URL + context.resolvedUrl,
			},
		},
	};
}

export default BlogCategoryPage;
