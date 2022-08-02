import { getSinglePost, getPosts } from '@services/ghost/posts';
import { Col, Row } from 'antd';
import moment from 'moment';
import Head from 'next/head';
import styles from './style.module.less';

const PostPage = ({ post }) => {
	const postImage = `${process.env.NEXT_PUBLIC_APP_URL}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvolunteer-illustration.ff9f1da2.png&w=1080&q=75`;
	const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`;

	return (
		<>
			<Head>
				<title>{post.title}</title>
				<meta name="description" content={post.custom_excerpt || post.excerpt} />
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={post.custom_excerpt || post.excerpt} />
				<meta property="og:url" content={postUrl} />
				<meta property="og:article:author" content="aaa" />
				<meta property="og:type" content="article" />
				<meta property="og:section" content={post.primary_tag.name} />
				<meta property="og:image" content={post.feature_image || postImage} />
				<meta name="twitter:images" content={post.feature_image || postImage} />
				<meta name="twitter:title" content={post.title} />
				<meta name="twitter:description" content={post.custom_excerpt || post.excerpt} />
			</Head>
			<Row className={styles.postHeader} align="middle">
				{post.feature_image !== null && (
					<Col className={styles.featureImage} sm={{ span: 24, order: 0, offset: 0 }} md={{ span: 8, order: 1, offset: 1 }}>
						<img src={post.feature_image} alt={post.title} />
					</Col>
				)}
				<Col xs={{ span: 24, order: 1 }} md={{ span: 15, order: 0 }}>
					<h1>{post.title}</h1>
					<div className={styles.postInfo}>
						{post.primary_tag.name}
						<span className={styles.sep} />
						published at {moment(post.published_at).format('ll')} by {post.primary_author?.name}
						<span className={styles.sep} />
						{post.reading_time} min read
					</div>
				</Col>
			</Row>
			<article className={styles.article}>
				<div dangerouslySetInnerHTML={{ __html: post.html }} />
			</article>
		</>
	);
};

export async function getStaticPaths() {
	const posts = await getPosts();

	const paths = posts.map((post) => ({
		params: { slug: post.slug },
	}));

	return { paths, fallback: false };
}

export async function getStaticProps(context) {
	const post = await getSinglePost(context.params.slug);

	if (!post) {
		return {
			notFound: true,
		};
	}

	return {
		props: { post },
	};
}

export default PostPage;
