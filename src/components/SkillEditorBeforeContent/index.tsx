import { useEffect, useState } from 'react';
import UserSkillShareSettingsModal from '@components/modals/UserSkillShareSettingsModal';
import { gtmEvent } from '@helpers/gtm';
import {
	editUserSkillMutation,
	getUserSkillOptionsQuery,
	publishUserSkillMutation,
} from '@services/graphql/queries/userSkill';
import { Button, Grid, message, PageHeader, Select, Space, Tooltip } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import { BiWorld, BiStreetView, BiLinkAlt, BiCopy, BiLinkExternal } from 'react-icons/bi';
import { GoGear } from 'react-icons/go';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const { useBreakpoint } = Grid;

export enum UserSkillViewModeEnum {
	ONLY_ME = 'only_me',
	BY_LINK = 'by_link',
	EVERYONE = 'everyone',
}

const SkillEditorBeforeContent = () => {
	const screens = useBreakpoint();
	const router = useRouter();
	const { skillId } = router.query;

	const [selectedViewMode, setSelectedViewMode] = useState(UserSkillViewModeEnum.BY_LINK);
	const [isPublished, setIsPublished] = useState(false);
	const [shareLink, setShareLink] = useState(null);
	const [showShareConfigModal, setShowShareConfigModal] = useState(false);

	// GraphQL queries
	const [, updateUserSkillData] = useMutation(editUserSkillMutation);
	const [, publishUserSkill] = useMutation(publishUserSkillMutation);
	const [{ data: userSkillData, fetching: userSkillFetching, error: userSkillError }] = useQuery({
		query: getUserSkillOptionsQuery,
		variables: { id: skillId },
		pause: !skillId,
	});

	useEffect(() => {
		if (userSkillData) {
			setSelectedViewMode(userSkillData.userSkill.viewMode as UserSkillViewModeEnum);
			setIsPublished(!userSkillData.userSkill.isDraft);
			setShareLink(userSkillData.userSkill.shareLink);
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
			const { data, error } = await publishUserSkill({ recordId: skillId, host: window.location.origin });

			if (error) {
				message.error(error.message);
				return;
			}

			setIsPublished(true);
			setShareLink(data?.publishUserSkill.shareLink);

			gtmEvent('PublishUserSkillEvent', { skillName: userSkillData?.userSkill.skill.name });

			message.success('User skill published!');
		} catch (error) {
			message.error(error.message);
		}
	};

	const handleViewUserSkill = () => {
		if (shareLink) {
			window.open(shareLink, '_blank');
		}
	};

	const handleCopyShareLink = () => {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard?.writeText(shareLink);
			message.success('The skill link copied to clipboard');
		}
	};

	const handleSettingsSave = () => {
		setShowShareConfigModal(false);
		message.success('The user skill settings updated');
	};

	return (
		<>
			<UserSkillShareSettingsModal
				visible={showShareConfigModal}
				onCancel={() => setShowShareConfigModal(false)}
				onSave={() => handleSettingsSave()}
				userSkillId={userSkillData?.id}
			/>
			<div className="site-page-header-ghost-wrapper">
				<PageHeader
					className={styles.pageHeader}
					ghost={false}
					title={isPublished ? 'Published' : 'Draft'}
					subTitle={
						screens.sm
							? `Last update at ${moment(userSkillData?.userSkill.updatedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`
							: null
					}
					extra={[
						<Button key="ConfigKey" type="ghost" size="small" onClick={() => setShowShareConfigModal(true)}>
							<GoGear size={18} />
						</Button>,
						<>
							{isPublished && (
								<Space key="viewModeKey">
									{screens.sm && <div>View Mode</div>}
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
								</Space>
							)}
						</>,
						<>
							{!isPublished ? (
								<Button key="1" type="primary" onClick={handlePublishBtn}>
									Publish
								</Button>
							) : (
								<Button
									key="1"
									type="primary"
									onClick={handleViewUserSkill}
									style={{ display: 'inline-flex', alignItems: 'center' }}
								>
									View <BiLinkExternal style={{ marginLeft: '8px' }} />
								</Button>
							)}
						</>,
						<>
							{isPublished && navigator.clipboard && window.isSecureContext && (
								<Tooltip key="2" title="Copy link">
									<Button type="text" shape="circle" size="small" onClick={handleCopyShareLink}>
										<BiCopy />
									</Button>
								</Tooltip>
							)}
						</>,
					]}
				/>
			</div>
		</>
	);
};

export default SkillEditorBeforeContent;
