import { fetchPost, fetchPosts } from '@models/post';
import { Breadcrumb, Col, Row } from 'antd';
import Blocks from 'editorjs-blocks-react-renderer';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import styles from './style.module.less';

const PostPage = ({ post }) => {
	const postImage = process.env.NEXT_PUBLIC_DEFAULT_POST_IMAGE;
	const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`;

	return (
		<>
			<Head>
				<title>{post.title}</title>
				<meta name="description" content={post.description} />
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={post.description} />
				<meta property="og:url" content={postUrl} />
				<meta property="og:article:author" content="aaa" />
				<meta property="og:type" content="article" />
				<meta property="og:section" content={post.category.name} />
				<meta property="og:image" content={post.featureImage || postImage} />
				<meta name="twitter:images" content={post.featureImage || postImage} />
				<meta name="twitter:title" content={post.title} />
				<meta name="twitter:description" content={post.description} />
			</Head>
			<Breadcrumb>
				<Breadcrumb.Item>
					<Link href="/blog">
						<a>Blog</a>
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>{post.category.name}</Breadcrumb.Item>
			</Breadcrumb>
			<Row className={styles.postHeader} align="middle">
				<Col className={styles.featureImage} sm={{ span: 24, order: 0, offset: 0 }} md={{ span: 8, order: 1, offset: 1 }}>
					<img src={post.featureImage || postImage} alt={post.title} />
				</Col>
				<Col xs={{ span: 24, order: 1 }} md={{ span: 15, order: 0 }}>
					<h1>{post.title}</h1>
					<div className={styles.postInfo}>
						Published at {moment(post.publishedAt).format('ll')} by {post.author?.fullName}
						<span className={styles.sep} />
						{post.readingTime > 1 ? `${post.readingTime} min read` : 'Less than 1 min read'}
					</div>
				</Col>
			</Row>
			<article className={styles.article}>
				{/* <div dangerouslySetInnerHTML={{ __html: post.content }} /> */}
				<Blocks data={post.content} />
			</article>
		</>
	);
};

export async function getStaticPaths() {
	try {
		const { posts, error } = await fetchPosts();

		if (error) {
			console.error(error);
			return { paths: [], fallback: 'blocking' };
		}

		if (!posts) {
			return { paths: [], fallback: 'blocking' };
		}

		const paths = posts.map((post) => ({
			params: { slug: post.slug },
		}));

		return { paths, fallback: 'blocking' };
	} catch (error) {
		throw new Error(error);
	}
}

export async function getStaticProps(context) {
	try {
		const { post, error } = await fetchPost({ slug: context.params.slug });

		if (error) {
			console.error(error);
			return { notFound: true };
		}

		return {
			props: { post: { ...post, content: JSON.parse(post.content) } },
			revalidate: 10,
		};
	} catch (error) {
		console.error(error);
		return {
			notFound: true,
		};
	}
}

export default PostPage;
