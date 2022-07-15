/* eslint-disable @next/next/no-server-import-in-page */
import { ssrGraphqlClient } from '@services/graphql/client';
import { postCategoriesDataQuery } from '@services/graphql/queries/postCategory';
import { NextResponse, NextRequest } from 'next/server';

//@ts-ignore
const PATTERNS = [[new URLPattern({ pathname: '/:locale/:slug' }), ({ pathname }) => pathname.groups]];

const parseParams: any = (url: string) => {
	const input = url.split('?')[0];
	let result = {};

	for (const [pattern, handler] of PATTERNS) {
		const patternResult = pattern.exec(input);
		if (patternResult !== null && 'pathname' in patternResult) {
			result = handler(patternResult);
			break;
		}
	}
	return result;
};

export async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith('/blog')) {
		const { slug } = parseParams(request.url);

		if (!slug) {
			return NextResponse.next();
		}

		const client = ssrGraphqlClient(request.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME]);
		const categoriesResponse = await client.query(postCategoriesDataQuery).toPromise();
		const categories = categoriesResponse.data?.postCategories.map((cat) => cat.slug);

		if (slug && categories.includes(slug)) {
			return NextResponse.rewrite(new URL('/blog/category/' + slug, request.url));
		}

		return NextResponse.rewrite(new URL('/blog/post/' + slug, request.url));
	}

	return NextResponse.next();
}
