import { useContext, useEffect, useState } from 'react';
import PostSettingsModal from '@components/modals/PostSettingsModal';
import { PageContext } from '@layouts/ProtectedLayout';
import { updatePostMutation, publishPostMutation, createPostMutation } from '@services/graphql/queries/post';
import { Button, Grid, message, PageHeader, Select, Space } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import { BiWorld, BiStreetView, BiLinkAlt, BiLinkExternal } from 'react-icons/bi';
import { GoGear } from 'react-icons/go';
import { useMutation } from 'urql';
import styles from './style.module.less';

const { useBreakpoint } = Grid;

export enum PostViewModeEnum {
	ONLY_ME = 'only_me',
	BY_LINK = 'by_link',
	EVERYONE = 'everyone',
}

const PostEditorBeforeContent = () => {
	const screens = useBreakpoint();
	const router = useRouter();

	const [selectedViewMode, setSelectedViewMode] = useState(PostViewModeEnum.BY_LINK);
	const [isPublished, setIsPublished] = useState(false);
	const [showPostConfigModal, setShowPostConfigModal] = useState(false);
	const { pageData: postData, setPageData: setPostData } = useContext<any>(PageContext);

	// GraphQL queries
	const [, createPost] = useMutation(createPostMutation);
	const [, updatePost] = useMutation(updatePostMutation);
	const [, publishPost] = useMutation(publishPostMutation);

	useEffect(() => {
		if (postData) {
			setSelectedViewMode(postData.viewMode as PostViewModeEnum);
			setIsPublished(!postData.isDraft);
		}
	}, [postData]);

	const handleViewModeSelect = async (viewMode: PostViewModeEnum) => {
		try {
			const { error } = await updatePost({ recordId: postData.id, data: { viewMode: viewMode.toUpperCase() } });

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

	const handleSaveBtn = async () => {
		try {
			let response = null;
			const data = {
				title: postData.title,
				content: JSON.stringify(postData.content),
				slug: postData.slug,
			};

			if (postData.id) {
				response = await updatePost({ recordId: postData.id, data });
			} else {
				response = await createPost({ data });
			}

			if (response.error) {
				message.error(response.error.message);
				return;
			}

			message.success('Post saved!');

			if (response.data.createPost) {
				router.push(router.pathname + '/' + response.data.createPost.id, undefined, { shallow: true });
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const handlePublishBtn = async () => {
		try {
			const { data, error } = await publishPost({ recordId: postData.id });

			if (error) {
				message.error(error.message);
				return;
			}

			setIsPublished(true);

			message.success('Post published!');
		} catch (error) {
			message.error(error.message);
		}
	};

	const handleViewPost = () => {
		if (postData.id) {
			window.open(process.env.NEXT_PUBLIC_APP_URL + '/blog/' + postData.slug, '_blank');
		}
	};

	const handleSettingsSave = () => {
		setShowPostConfigModal(false);
		message.success('The post settings updated');
	};

	return (
		<>
			<PostSettingsModal
				visible={showPostConfigModal}
				post={postData}
				onCancel={() => setShowPostConfigModal(false)}
				onSave={() => handleSettingsSave()}
			/>
			<div className="site-page-header-ghost-wrapper">
				<PageHeader
					className={styles.pageHeader}
					ghost={false}
					title={isPublished ? 'Published' : 'Draft'}
					subTitle={
						screens.sm && postData?.updatedAt
							? `Last update at ${moment(postData?.updatedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`
							: null
					}
					extra={[
						<>
							{postData?.id && (
								<Button key="ConfigKey" type="ghost" size="small" onClick={() => setShowPostConfigModal(true)}>
									<GoGear size={18} />
								</Button>
							)}
						</>,
						<div key="viewModeKey">
							{isPublished && (
								<Space>
									{screens.sm && <div>View Mode</div>}
									{selectedViewMode && (
										<Select
											value={selectedViewMode}
											loading={!postData}
											className={styles.select}
											onChange={() => {}}
											size="small"
											bordered={false}
											onSelect={handleViewModeSelect}
										>
											<Select.Option value={PostViewModeEnum.ONLY_ME}>
												<BiStreetView style={{ marginRight: '4px' }} /> Only me
											</Select.Option>
											<Select.Option value={PostViewModeEnum.BY_LINK}>
												<BiLinkAlt style={{ marginRight: '4px' }} /> By link
											</Select.Option>
											<Select.Option value={PostViewModeEnum.EVERYONE}>
												<BiWorld style={{ marginRight: '4px' }} /> Everyone
											</Select.Option>
										</Select>
									)}
								</Space>
							)}
						</div>,
						<div key="saveButton">
							<Button type={!postData?.id ? 'primary' : 'default'} onClick={handleSaveBtn}>
								Save
							</Button>
						</div>,
						<>
							{!!postData?.id && (
								<div key="publishButton">
									{!isPublished ? (
										<Button type={postData?.id ? 'primary' : 'default'} onClick={handlePublishBtn}>
											Publish
										</Button>
									) : (
										<Button
											type={postData?.id ? 'primary' : 'default'}
											onClick={handleViewPost}
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											View <BiLinkExternal style={{ marginLeft: '8px' }} />
										</Button>
									)}
								</div>
							)}
						</>,
					]}
				/>
			</div>
		</>
	);
};

export default PostEditorBeforeContent;
