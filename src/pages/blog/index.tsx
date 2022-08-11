import { FC } from 'react';
import { fetchPosts } from '@models/post';
import { Card, Col, Row } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import styles from './style.module.less';

const PostsPage: FC = (props: any) => (
	<>
		<Head>
			<title>Skillkit.me Blog - The best tips, insights and career advice</title>
			<meta
				name="description"
				content="Welcome to the Skillkit.me Blog! Here you&#39;ll find the best information about resume and cover letter writing, job search and career advice. Read our blog articles to help you build a successful career."
			/>
			<meta property="og:title" content="killkit.me Blog - The best tips, insights and career advice" />
			<meta
				property="og:description"
				content="Welcome to the Skillkit.me Blog! Here you&#39;ll find the best information about resume and cover letter writing, job search and career advice. Read our blog articles to help you build a successful career."
			/>
			<meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL + '/blog'} />
			<meta property="og:article:author" content="aaa" />
			<meta property="og:type" content="website" />
			<meta
				property="og:image"
				content="https://cdn.sanity.io/images/n0lpvrpe/prod/c3b822ec8b441294d8e1835406f367e795d6dbfc-634x521.png"
			/>
			<meta
				name="twitter:images"
				content="https://cdn.sanity.io/images/n0lpvrpe/prod/c3b822ec8b441294d8e1835406f367e795d6dbfc-634x521.png"
			/>
			<meta name="twitter:title" content="killkit.me Blog - The best tips, insights and career advice" />
			<meta
				name="twitter:description"
				content="Welcome to the Skillkit.me Blog! Here you&#39;ll find the best information about resume and cover letter writing, job search and career advice. Read our blog articles to help you build a successful career."
			/>
		</Head>
		<h1 className={styles.header}>Our Blog</h1>
		<Row gutter={16}>
			{props.posts?.map((post) => (
				<Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} key={post.id}>
					<Link href={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`} passHref>
						<Card
							className={styles.postCard}
							bordered={true}
							hoverable={true}
							cover={
								<img
									src={post.featureImage ? post.featureImage : process.env.NEXT_PUBLIC_DEFAULT_POST_IMAGE}
									alt={post.title}
									className={styles.featureImage}
								/>
							}
						>
							<Card.Meta title={post.title} description={post.description} />
						</Card>
					</Link>
				</Col>
			))}
		</Row>
	</>
);

export async function getServerSideProps() {
	try {
		const { posts, error } = await fetchPosts();

		if (error) {
			console.error(error);
			return { notFound: true };
		}

		if (!posts) {
			return { notFound: true };
		}

		return {
			props: { posts },
		};
	} catch (error) {
		throw new Error(error);
	}
}

export default PostsPage;
