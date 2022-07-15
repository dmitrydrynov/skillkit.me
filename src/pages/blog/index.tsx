import { PostViewModeEnum } from '@components/PostEditorBeforeContent';
import { ssrGraphqlClient } from '@services/graphql/client';
import { postsDataQuery } from '@services/graphql/queries/post';
import { postCategoriesDataQuery } from '@services/graphql/queries/postCategory';
import Link from 'next/link';

const BlogPage = ({ posts, categories }) => {
	return (
		<>
			{/* <Head>
				<title>Blog</title>
				<meta name="description" content="Latest news and articles about Skillkit" />
				<meta property="og:title" content="Latest news and articles about Skillkit" key="og:title" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://skillkit.me/blog" />
				<meta name="twitter:title" content="Blog" />
				<meta name="twitter:description" content="Latest news and articles about Skillkit" />
			</Head> */}
			<h1>Our Blog</h1>
			{categories?.length > 0 && (
				<>
					<h2>Categories</h2>
					{categories.map((cat) => (
						<p key={cat.id}>
							<Link href={`/blog/${cat.slug}`}>
								<a>{cat.name}</a>
							</Link>
						</p>
					))}
				</>
			)}
			{posts?.length > 0 && (
				<>
					<h2>Posts</h2>
					{posts.map((post) => (
						<p key={post.id}>
							<Link href={`/blog/${post.slug}`}>
								<a>{post.title}</a>
							</Link>
						</p>
					))}
				</>
			)}
		</>
	);
};

export async function getServerSideProps(context) {
	const client = ssrGraphqlClient(context.req.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME]);

	const postsResponse = await client
		.query(postsDataQuery, {
			where: { isDraft: false, viewMode: { equals: PostViewModeEnum.EVERYONE } },
		})
		.toPromise();

	const categoriesResponse = await client.query(postCategoriesDataQuery).toPromise();

	// console.log(categoriesResponse);

	return {
		props: {
			posts: postsResponse.data?.posts,
			categories: categoriesResponse.data?.postCategories,
		},
	};
}

export default BlogPage;
