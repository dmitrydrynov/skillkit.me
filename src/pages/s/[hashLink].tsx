import { ReactElement, useEffect, useState } from 'react';
import FileGallery from '@components/FileGallery';
import { capitalizedText, readyText } from '@helpers/text';
import ShareLayout from '@layouts/ShareLayout';
import { NextPageWithLayout } from '@pages/_app';
import { userDataQuery } from '@services/graphql/queries/user';
import { userFilesQuery } from '@services/graphql/queries/userFile';
import { userJobsQuery } from '@services/graphql/queries/userJob';
import { userSchoolsQuery } from '@services/graphql/queries/userSchool';
import { getUserSkillByHashQuery } from '@services/graphql/queries/userSkill';
import { userToolsQuery } from '@services/graphql/queries/userTool';
import { RootState } from '@store/configure-store';
import { UserSkillViewModeEnum, getSkillLevel, SkillLevel } from 'src/definitions/skill';
import { Col, List, message, Progress, Row, Space, Spin, Timeline, Typography } from 'antd';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import countryList from 'react-select-country-list';
import { useQuery } from 'urql';
import styles from './style.module.less';

const ReactViewer = dynamic(() => import('react-viewer'), { ssr: false });

const UserSkillSharePage: NextPageWithLayout = () => {
	const router = useRouter();

	const { hashLink } = router.query;

	const userId = useSelector((state: RootState) => state.user.id);
	const [country, setCountry] = useState(null);
	const [userSkillData, setUserSkillData] = useState(null);
	const [level, setLevel] = useState<SkillLevel>();
	const [viewerVisible, setViewerVisible] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	const [{ data: userData, error: userDataError }] = useQuery({
		query: userDataQuery,
		variables: { id: userId },
		pause: !hashLink || !userId,
	});
	const [{ data, error }] = useQuery({
		query: getUserSkillByHashQuery,
		variables: { hash: hashLink },
		pause: !hashLink,
	});
	const [{ data: userFilesData, fetching: userFilesFetching }] = useQuery({
		query: userFilesQuery,
		variables: { attachType: 'UserSkill', attachId: userSkillData?.id },
		pause: !userSkillData,
	});
	const [{ data: userToolsData, fetching: userToolFetching }] = useQuery({
		query: userToolsQuery,
		variables: { userSkillId: userSkillData?.id },
		requestPolicy: 'network-only',
		pause: !userSkillData,
	});
	const [{ data: userSchoolsData, fetching: userSchoolFetching }] = useQuery({
		query: userSchoolsQuery,
		variables: { userSkillId: userSkillData?.id },
		requestPolicy: 'network-only',
		pause: !userSkillData,
	});
	const [{ data: userJobsData, fetching: userJobFetching }] = useQuery({
		query: userJobsQuery,
		variables: { userSkillId: userSkillData?.id },
		requestPolicy: 'network-only',
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

	useEffect(() => {
		if (!userData?.user.country) return;

		setCountry(countryList().getLabel(userData.user.country));
	}, [userData]);

	return (
		<>
			<Head>
				<title>
					I can {userSkillData?.skill.name} - {userData?.user.fullName} on SkillKit
				</title>
			</Head>
			<div className={styles.container}>
				<Row>
					<Col xs={{ span: 24 }} lg={{ span: 16 }}>
						<Space direction="vertical" size={40} style={{ width: '100%' }}>
							<div className={styles.welcomeSection}>
								<p>
									Hello,
									<br />
									My name is {userData?.user.fullName}
									<br />
									I&apos;m from {country}.
									<br />
									I&apos;m {userData?.user.age} years old.
								</p>
								<img src={userData?.user.avatar} alt={'avatar'} />
							</div>

							<div className={styles.titleSection}>
								<div>I can</div>
								<h2 className={styles.title}>{capitalizedText(userSkillData?.skill.name)}</h2>
							</div>

							{userSkillData?.description?.length > 0 && (
								<div className={styles.descriptionSection}>
									<p className={styles.description}>{userSkillData?.description ? readyText(userSkillData?.description) : ''}</p>
								</div>
							)}

							<div className={styles.toolsSection}>
								<div className={styles.headerContainer}>
									<h2>I use for this</h2>
								</div>
								{userToolsData?.userTools.length > 0 && (
									<List
										className={styles.list}
										size="small"
										dataSource={userToolsData.userTools}
										loading={userToolFetching}
										renderItem={(item: any) => (
											<List.Item className={styles.listItem}>
												<List.Item.Meta
													className={styles.listItemMeta}
													title={item.title}
													description={
														item.description && (
															<Typography.Paragraph ellipsis={{ tooltip: item.description }}>
																{readyText(item.description)}
															</Typography.Paragraph>
														)
													}
												/>
											</List.Item>
										)}
									/>
								)}
							</div>
							<div className={styles.schoolsSection}>
								<div className={styles.headerContainer}>
									<h2>I learned this skill in</h2>
								</div>
								{userSchoolsData?.userSchools.length > 0 && (
									<Spin spinning={userSchoolFetching}>
										<Timeline mode="left">
											{userSchoolsData?.userSchools.map((item: any, indx: number) => (
												<Timeline.Item key={indx}>
													<div className={styles.userSchoolListItem}>
														<div className={styles.userSchoolRange}>
															{moment(item.startedAt).format('MMM, YYYY') +
																' — ' +
																(item.finishedAt ? moment(item.finishedAt).format('MMM, YYYY') : 'Now')}
														</div>
														<div className={styles.userSchoolTitle}>{item.title}</div>
														{!!item.description && <p className={styles.userSchoolDesc}>{readyText(item.description)}</p>}
													</div>
												</Timeline.Item>
											))}
										</Timeline>
									</Spin>
								)}
							</div>
							<div className={styles.jobsSection}>
								<div className={styles.headerContainer}>
									<h2>I used this skill in the following jobs</h2>
								</div>
								{userJobsData?.userJobs.length > 0 && (
									<Spin spinning={userJobFetching}>
										<Timeline mode="left">
											{userJobsData?.userJobs.map((item: any, indx: number) => (
												<Timeline.Item key={indx}>
													<Space size="large" className={styles.userJobListItem}>
														<div className={styles.userJobInfo}>
															<div className={styles.userJobRange}>
																{moment(item.startedAt).format('MMM, YYYY') +
																	' — ' +
																	(item.finishedAt ? moment(item.finishedAt).format('MMM, YYYY') : 'Now')}
															</div>
															<div className={styles.userJobTitle}>
																{item.title} — {item.position}
															</div>
															{!!item.description && <p className={styles.userJobDesc}>{readyText(item.description)}</p>}
														</div>
													</Space>
												</Timeline.Item>
											))}
										</Timeline>
									</Spin>
								)}
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
									<h2>Examples</h2>
								</div>
								<FileGallery
									fileList={userFilesData?.userFiles}
									onlyView
									onItemClick={(recordId) => {
										setSelectedImage(recordId);
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
					activeIndex={userFilesData?.userFiles
						.filter((i: any) => i.type === 'FILE')
						.findIndex((i: any) => i.id === selectedImage)}
					noToolbar={false}
					noImgDetails
					customToolbar={(toolbar) => {
						toolbar = toolbar.filter((tool) => ['download', 'scaleX', 'scaleY'].includes(tool.key) === false);
						console.log(toolbar);
						return toolbar;
					}}
					showTotal={false}
					images={userFilesData?.userFiles
						.filter((i: any) => i.type === 'FILE')
						.map((i: any) => {
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
