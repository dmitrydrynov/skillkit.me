import { ReactElement, useEffect, useState } from 'react';
import FileGallery from '@components/FileGallery';
import { capitalizedText, readyText } from '@helpers/text';
import ShareLayout from '@layouts/ShareLayout';
import { NextPageWithLayout } from '@pages/_app';
import { userFilesQuery } from '@services/graphql/queries/userFile';
import { getUserSkillByHashQuery } from '@services/graphql/queries/userSkill';
import { UserSkillViewModeEnum, getSkillLevel, SkillLevel } from 'src/definitions/skill';
import { Col, message, Progress, Row, Space } from 'antd';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'urql';
import styles from './style.module.less';

const ReactViewer = dynamic(() => import('react-viewer'), { ssr: false });

const UserSkillSharePage: NextPageWithLayout = () => {
	const router = useRouter();
	const { hashLink } = router.query;

	const [userSkillData, setUserSkillData] = useState(null);
	const [level, setLevel] = useState<SkillLevel>();
	const [viewerVisible, setViewerVisible] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	const [{ data, fetching, error }] = useQuery({
		query: getUserSkillByHashQuery,
		variables: { hash: hashLink },
		pause: !hashLink,
	});
	const [{ data: userFilesData, fetching: userFilesFetching }] = useQuery({
		query: userFilesQuery,
		variables: { attachType: 'UserSkill', attachId: userSkillData?.id },
		pause: !userSkillData,
	});

	useEffect(() => {
		if (error) message.error(error.message);
	}, [error]);

	useEffect(() => {
		if (data) {
			const userSkill = data.userSkillByHash;

			setUserSkillData(userSkill);
			setLevel(getSkillLevel(userSkill.level));
		}
	}, [data?.userSkillByHash]);

	return (
		<>
			<Head>
				<title>I can {userSkillData?.skill.name} - SkillKit</title>
			</Head>
			<div className={styles.container}>
				<Row>
					<Col xs={{ span: 24 }} lg={{ span: 16 }}>
						<Space direction="vertical" size={40} style={{ width: '100%' }}>
							<div className={styles.titleSection}>
								<div>I can</div>
								<h2 className={styles.title}>{capitalizedText(userSkillData?.skill.name)}</h2>
							</div>
							<div className={styles.descriptionSection}>
								<p className={styles.description}>{userSkillData?.description ? readyText(userSkillData?.description) : ''}</p>
							</div>
						</Space>
					</Col>
					<Col xs={{ span: 24 }} lg={{ span: 7, offset: 1 }}>
						<div className={styles.levelName}>
							<strong>{level?.label}</strong> level
						</div>
						<Progress
							className={styles.progressBar}
							percent={level?.index * 20}
							steps={5}
							status="active"
							strokeColor={level?.color}
							showInfo={false}
						/>
					</Col>
				</Row>
				{userFilesData?.userFiles.length > 0 && (
					<Row style={{ marginTop: '40px' }}>
						<Col flex={1}>
							<div className={styles.worksSection}>
								<div className={styles.headerContainer}>
									<h2>Work examples</h2>
								</div>
								<FileGallery
									fileList={userFilesData?.userFiles}
									onlyView
									onItemClick={(itemIndex) => {
										setSelectedImage(itemIndex);
										setViewerVisible(true);
									}}
								/>
							</div>
						</Col>
					</Row>
				)}
				<ReactViewer
					visible={viewerVisible}
					onClose={() => setViewerVisible(false)}
					activeIndex={selectedImage}
					images={userFilesData?.userFiles.map((i: any) => {
						return {
							src: i.url,
							alt: i.title,
						};
					})}
				/>
			</div>
		</>
	);
};

UserSkillSharePage.getLayout = (page: ReactElement) => (
	<ShareLayout title="User skill data" viewMode={UserSkillViewModeEnum.BY_LINK}>
		{page}
	</ShareLayout>
);

export default UserSkillSharePage;
