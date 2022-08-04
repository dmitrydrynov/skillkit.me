import { FC } from 'react';
import { ssrGraphqlClient } from '@services/graphql/client';
import { postsDataQuery } from '@services/graphql/queries/post';
import { Card, Col, Row } from 'antd';
import Link from 'next/link';
import styles from './style.module.less';

const PostsPage: FC = (props: any) => (
	<>
		<h1 className={styles.header}>Our Blog</h1>
		<Row gutter={16}>
			{props.posts?.map((post) => (
				<Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} key={post.id}>
					<Card
						className={styles.postCard}
						bordered={true}
						hoverable={true}
						cover={
							<img
								src={
									post.featureImage
										? post.featureImage
										: 'https://cdn.sanity.io/images/n0lpvrpe/skillkit/304987139456267f67485058af6dd9d0da201b25-640x360.jpg'
								}
								alt={post.title}
								className={styles.featureImage}
							/>
						}>
						<Card.Meta
							title={
								<Link href={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}>
									<a>{post.title}</a>
								</Link>
							}
							description={post.description}
						/>
					</Card>
				</Col>
			))}
		</Row>
	</>
);

export async function getStaticProps(context) {
	const client = ssrGraphqlClient();

	const { data, error } = await client.query(postsDataQuery).toPromise();

	if (error) {
		return { notFound: true };
	}

	if (!data) {
		return {
			notFound: true,
		};
	}

	const posts = data?.posts;

	return {
		props: { posts: posts || null },
	};
}

export default PostsPage;
