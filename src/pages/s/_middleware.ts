import { ssrGraphqlClient } from '@services/graphql/client';
import { getUserSkillVisibilityByHashQuery } from '@services/graphql/queries/userSkill';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
	const response = NextResponse.next();
	const { hashLink }: any = req.page.params;

	if (!hashLink) return NextResponse.redirect('/user/skills');

	const token = req.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME];
	const client = ssrGraphqlClient(token);

	const { data, error } = await client
		.query(getUserSkillVisibilityByHashQuery, {
			hash: hashLink,
		})
		.toPromise();

	if (error) {
		console.error('[Middleware ERROR][' + req.page.name + ']', error.message);
	}

	// if(data.userSkillByHash.viewMode === 'only_me' && ) {
	// }

	return response;
}
