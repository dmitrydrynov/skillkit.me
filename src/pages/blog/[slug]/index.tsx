import BlogCategoryPage from '@components/pages/BlogCategoryPage';
import BlogPostPage from '@components/pages/BlogPostPage';
import NotFoundPage from '@pages/404';

const BlogSomePage = ({ type, data, meta }) => {
	if (type === 'category' && data) {
		return <BlogCategoryPage data={data} meta={meta} />;
	}

	if (type === 'post' && data) {
		return <BlogPostPage data={data} meta={meta} />;
	}

	return <NotFoundPage />;
};

export async function getServerSideProps(context) {
	const { slug } = context.query;

	if (['articles', 'updates'].includes(slug)) {
		return {
			props: { type: 'category', data: null, meta: {} },
		};
	}

	return {
		props: { type: 'post', data: null, meta: {} },
	};
}

export default BlogSomePage;
