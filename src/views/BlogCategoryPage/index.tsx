import Head from 'next/head';

const BlogCategoryPage = ({ data: category, meta }) => {
	return (
		<>
			<Head>
				<title>Category</title>
			</Head>
			<p>Category page</p>
		</>
	);
};

export default BlogCategoryPage;
