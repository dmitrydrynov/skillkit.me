import { FC } from 'react';
import { getPosts } from '@services/ghost/posts';
import Link from 'next/link';

const PostsPage: FC = (props: any) => (
	<ul>
		{props.posts?.map((post) => (
			<li key={post.id}>
				<Link href={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}>
					<a>{post.title}</a>
				</Link>
			</li>
		))}
	</ul>
);

export async function getStaticProps(context) {
	const posts = await getPosts();

	console.log('posts', posts);

	if (!posts) {
		return {
			notFound: true,
		};
	}

	return {
		props: { posts: posts || null },
	};
}

export default PostsPage;
