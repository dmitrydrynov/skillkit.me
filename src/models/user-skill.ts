import { urqlServerClient } from '@services/graphql/client';
import { getUserSkillsForShareQuery } from '@services/graphql/queries/userSkill';

export const fetchUserSkillsListForShare = async () => {
	try {
		const { data, error } = await urqlServerClient().query(getUserSkillsForShareQuery).toPromise();

		if (error) {
			return {
				data: null,
				error,
			};
		}

		return { data: data.userSkillsForShare };
	} catch (error) {
		return {
			data: null,
			error,
		};
	}
};
