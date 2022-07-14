import { PostViewModeEnum } from '@components/PostEditorBeforeContent';
import { readingTimeOfEditorBlocks, textLimit } from '@helpers/text';
import { ssrGraphqlClient } from '@services/graphql/client';
import { getPostQuery } from '@services/graphql/queries/post';
import Blocks from 'editorjs-blocks-react-renderer';
import moment from 'moment';
import Head from 'next/head';
import styles from './style.module.less';

const BlogPostPage = ({ data: post, meta }) => {
	return (
		<>
			<Head>
				<title>{post.title}</title>
				<meta name="description" content={meta.description} />
				<meta property="og:title" content={post.title} key="og:title" />
				<meta property="og:type" content="article" />
				<meta property="og:url" content={meta.url} />
				<meta name="twitter:title" content={post.title} />
				<meta name="twitter:description" content={meta.description} />
				{post.viewMode !== PostViewModeEnum.EVERYONE && (
					<>
						<meta key="robots" name="robots" content="noindex,follow" />
						<meta key="googlebot" name="googlebot" content="noindex,follow" />
					</>
				)}
			</Head>
			<div className={styles.postHeader}>
				<h1>{post.title}</h1>
				<div className={styles.postInfo}>
					{post.category.name}
					<span className={styles.sep} />
					published at {moment(post.publishedAt).format('ll')} by {post.author.fullName}
					<span className={styles.sep} />
					{meta.readingTime} min read
				</div>
			</div>
			<article className={styles.article}>
				<Blocks data={post.content} />
			</article>
		</>
	);
};

export async function getServerSideProps(context) {
	const { postSlug } = context.query;
	let postData: any = {};
	let description: string = 'Blog artical on Skillkit';

	if (postSlug) {
		const client = ssrGraphqlClient(context.req.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME]);

		const { data, error } = await client
			.query(getPostQuery, {
				where: { slug: { equals: postSlug } },
			})
			.toPromise();

		if (error) {
			return { notFound: true };
		}

		postData = data?.post;
	}

	const content = JSON.parse(postData.content);
	const firstParagraph = content.blocks.filter((block) => block.type === 'paragraph')[0];

	if (firstParagraph?.data.text) {
		description = textLimit(firstParagraph?.data.text, 170);
	}

	return {
		props: {
			data: { ...postData, content },
			meta: {
				description,
				url: process.env.NEXT_PUBLIC_APP_URL + context.resolvedUrl,
				readingTime: readingTimeOfEditorBlocks(content.blocks),
			},
		},
	};
}

export default BlogPostPage;
