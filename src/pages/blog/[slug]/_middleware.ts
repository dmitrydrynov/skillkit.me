import { ssrGraphqlClient } from '@services/graphql/client';
import { postCategoriesDataQuery } from '@services/graphql/queries/postCategory';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const page: any = request.page;
	const { slug, postSlug, categorySlug } = page.params;
	const client = ssrGraphqlClient(request.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME]);
	const categoriesResponse = await client.query(postCategoriesDataQuery).toPromise();
	const categories = categoriesResponse.data?.postCategories.map((cat) => cat.slug);

	if (postSlug || categorySlug) {
		return NextResponse.next();
	}

	if (slug && categories.includes(slug)) {
		return NextResponse.rewrite(new URL('/blog/category/' + slug, request.url));
	}

	return NextResponse.rewrite(new URL('/blog/post/' + slug, request.url));
}
