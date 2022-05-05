import { useEffect, useState } from 'react';
import { editUserSkillMutation, getUserSkillOptionsQuery } from '@services/graphql/queries/userSkill';
import { Button, message, PageHeader, Select, Space, Tooltip } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import { BiWorld, BiStreetView, BiLinkAlt, BiCopy, BiLinkExternal } from 'react-icons/bi';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

enum UserSkillViewModeEnum {
	ONLY_ME = 'only_me',
	BY_LINK = 'by_link',
	EVERYONE = 'everyone',
}

const SkillEditorBeforeContent = () => {
	const router = useRouter();
	const { skillId } = router.query;

	const [selectedViewMode, setSelectedViewMode] = useState(UserSkillViewModeEnum.ONLY_ME);
	const [isPublished, setIsPublished] = useState(false);

	// GraphQL queries
	const [, updateUserSkillData] = useMutation(editUserSkillMutation);
	const [{ data: userSkillData, fetching: userSkillFetching, error: userSkillError }] = useQuery({
		query: getUserSkillOptionsQuery,
		variables: { id: skillId },
		pause: !skillId,
	});

	useEffect(() => {
		if (userSkillData) {
			setSelectedViewMode(userSkillData?.userSkill.viewMode as UserSkillViewModeEnum);
			setIsPublished(!userSkillData?.userSkill.isDraft);
		}
	}, [userSkillData]);

	const handleViewModeSelect = async (viewMode: UserSkillViewModeEnum) => {
		try {
			const { error } = await updateUserSkillData({ recordId: skillId, data: { viewMode: viewMode.toUpperCase() } });

			if (error) {
				message.error(error.message);
				return;
			}

			setSelectedViewMode(viewMode);

			message.success('View mode changed.');
		} catch (error) {
			message.error(error.message);
		}
	};

	const handlePublishBtn = async () => {
		try {
			const { error } = await updateUserSkillData({ recordId: skillId, data: { isDraft: false } });

			if (error) {
				message.error(error.message);
				return;
			}

			setIsPublished(true);

			message.success('User skill published!');
		} catch (error) {
			message.error(error.message);
		}
	};

	return (
		<div className="site-page-header-ghost-wrapper">
			<PageHeader
				className={styles.pageHeader}
				ghost={false}
				title={isPublished ? 'Published' : 'Draft'}
				subTitle={`Last update at ${moment(userSkillData?.userSkill.updatedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`}
				extra={[
					<Space key="0">
						<div>View Mode</div>
						{selectedViewMode && (
							<Select
								value={selectedViewMode}
								loading={userSkillFetching}
								className={styles.select}
								onChange={() => {}}
								size="small"
								bordered={false}
								onSelect={handleViewModeSelect}
							>
								<Select.Option value={UserSkillViewModeEnum.ONLY_ME}>
									<BiStreetView style={{ marginRight: '4px' }} /> Only me
								</Select.Option>
								<Select.Option value={UserSkillViewModeEnum.BY_LINK}>
									<BiLinkAlt style={{ marginRight: '4px' }} /> By link
								</Select.Option>
								<Select.Option value={UserSkillViewModeEnum.EVERYONE}>
									<BiWorld style={{ marginRight: '4px' }} /> Everyone
								</Select.Option>
							</Select>
						)}
					</Space>,
					<>
						{!isPublished ? (
							<Button key="1" type="primary" onClick={handlePublishBtn}>
								Publish
							</Button>
						) : (
							<Button
								key="1"
								type="primary"
								onClick={() => router.push(userSkillData?.userSkill.shareLink)}
								style={{ display: 'inline-flex', alignItems: 'center' }}
							>
								View <BiLinkExternal style={{ marginLeft: '8px' }} />
							</Button>
						)}
					</>,
					<>
						{isPublished && (
							<Tooltip key="2" title="Copy link">
								<Button
									type="text"
									shape="circle"
									size="small"
									onClick={() => message.success('The skill link copied to clipboard')}
								>
									<BiCopy />
								</Button>
							</Tooltip>
						)}
					</>,
				]}
			/>
		</div>
	);
};

export default SkillEditorBeforeContent;
