import { FC } from 'react';
import { fetchPosts } from '@models/post';
import { Card, Col, Row } from 'antd';
import Link from 'next/link';
import styles from './style.module.less';

const PostsPage: FC = (props: any) => (
	<>
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
