import React, { ReactElement } from 'react';
import UserSkillEditor from '@components/editors/UserSkillEditor';
import SkillEditorMenu from '@components/menus/SkillEditorMenu';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { Alert } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SkillEditorBeforeContent = dynamic(() => import('@components/SkillEditorBeforeContent'), { ssr: false });

const SkillEditorPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { skillId } = router.query;

	return (
		<>
			<Alert
				style={{ marginBottom: '24px' }}
				message={
					<>
						You can change your name, age, city and other personal information in your{' '}
						<Link href="/settings/profile">
							<a target="_blank" rel="noreferrer">
								profile settings
							</a>
						</Link>
					</>
				}
				banner
			/>
			<UserSkillEditor userSkillId={skillId} />
		</>
	);
};

SkillEditorPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout title="Skill Editor" siderMenu={<SkillEditorMenu />} beforeContent={<SkillEditorBeforeContent />}>
		{page}
	</ProtectedLayout>
);

export default SkillEditorPage;
