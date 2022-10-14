import { useEffect, useState } from 'react';
import UserKitShareSettingsModal from '@components/modals/UserKitShareSettingsModal';
import { gtmEvent } from '@helpers/gtm';
import { editUserKitMutation, getUserKitOptionsQuery, publishUserKitMutation } from '@services/graphql/queries/userKit';
import { Button, Grid, message, PageHeader, Select, Space, Tooltip } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import { BiWorld, BiStreetView, BiLinkAlt, BiCopy, BiLinkExternal } from 'react-icons/bi';
import { GoGear } from 'react-icons/go';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const { useBreakpoint } = Grid;

export enum UserKitViewModeEnum {
	ONLY_ME = 'only_me',
	BY_LINK = 'by_link',
	EVERYONE = 'everyone',
}

const KitEditorBeforeContent = () => {
	const screens = useBreakpoint();
	const router = useRouter();
	const { kitId } = router.query;

	const [selectedViewMode, setSelectedViewMode] = useState(UserKitViewModeEnum.BY_LINK);
	const [isPublished, setIsPublished] = useState(false);
	const [shareLink, setShareLink] = useState(null);
	const [showShareConfigModal, setShowShareConfigModal] = useState(false);

	// GraphQL queries
	const [, updateUserKitData] = useMutation(editUserKitMutation);
	const [, publishUserKit] = useMutation(publishUserKitMutation);
	const [{ data: userKitData, fetching: userKitFetching, error: userKitError }] = useQuery({
		query: getUserKitOptionsQuery,
		variables: { id: kitId },
		pause: !kitId,
	});

	useEffect(() => {
		if (userKitData) {
			setSelectedViewMode(userKitData.userKit.viewMode as UserKitViewModeEnum);
			setIsPublished(!userKitData.userKit.isDraft);
			setShareLink(userKitData.userKit.shareLink);
		}
	}, [userKitData]);

	const handleViewModeSelect = async (viewMode: UserKitViewModeEnum) => {
		try {
			const { error } = await updateUserKitData({ recordId: kitId, data: { viewMode: viewMode.toUpperCase() } });

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
			const { data, error } = await publishUserKit({ recordId: kitId, host: window.location.origin });

			if (error) {
				message.error(error.message);
				return;
			}

			setIsPublished(true);
			setShareLink(data?.publishUserKit.shareLink);

			gtmEvent('PublishUserSkillKitEvent', { professionName: userKitData?.userKit.profession.name });

			message.success('The skill kit published!');
		} catch (error) {
			message.error(error.message);
		}
	};

	const handleViewUserKit = () => {
		if (shareLink) {
			window.open(shareLink, '_blank');
		}
	};

	const handleCopyShareLink = () => {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard?.writeText(shareLink);
			message.success('The user skill kit link copied to clipboard');
		}
	};

	const handleSettingsSave = () => {
		setShowShareConfigModal(false);
		message.success('The user skill kit settings updated');
	};

	return (
		<>
			<UserKitShareSettingsModal
				visible={showShareConfigModal}
				onCancel={() => setShowShareConfigModal(false)}
				onSave={() => handleSettingsSave()}
				userKitId={userKitData?.id}
			/>
			<div className="site-page-header-ghost-wrapper">
				<PageHeader
					className={styles.pageHeader}
					ghost={false}
					title={`Edit ${isPublished ? '' : 'draft'} skill kit`}
					subTitle={
						screens.sm
							? `Last update at ${moment(userKitData?.userKit.updatedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`
							: null
					}
					extra={[
						<Button key="ConfigKey" type="ghost" size="small" onClick={() => setShowShareConfigModal(true)}>
							<GoGear size={18} />
						</Button>,
						<div key="viewModeKey">
							{isPublished && (
								<Space>
									{screens.sm && <div>View Mode</div>}
									{selectedViewMode && (
										<Select
											value={selectedViewMode}
											loading={userKitFetching}
											className={styles.select}
											onChange={() => {}}
											size="small"
											bordered={false}
											onSelect={handleViewModeSelect}
										>
											<Select.Option value={UserKitViewModeEnum.ONLY_ME}>
												<BiStreetView style={{ marginRight: '4px' }} /> Only me
											</Select.Option>
											<Select.Option value={UserKitViewModeEnum.BY_LINK}>
												<BiLinkAlt style={{ marginRight: '4px' }} /> By link
											</Select.Option>
											<Select.Option value={UserKitViewModeEnum.EVERYONE}>
												<BiWorld style={{ marginRight: '4px' }} /> Everyone
											</Select.Option>
										</Select>
									)}
								</Space>
							)}
						</div>,
						<div key="publishButton">
							{!isPublished ? (
								<Button type="primary" onClick={handlePublishBtn}>
									Publish
								</Button>
							) : (
								<Button type="primary" onClick={handleViewUserKit} style={{ display: 'inline-flex', alignItems: 'center' }}>
									View <BiLinkExternal style={{ marginLeft: '8px' }} />
								</Button>
							)}
						</div>,
						<div key="copyPutton">
							{isPublished && navigator.clipboard && window.isSecureContext && (
								<Tooltip key="2" title="Copy link">
									<Button type="text" shape="circle" size="small" onClick={handleCopyShareLink}>
										<BiCopy />
									</Button>
								</Tooltip>
							)}
						</div>,
					]}
				/>
			</div>
		</>
	);
};

export default KitEditorBeforeContent;
