import { ReactElement, useEffect, useState } from 'react';
import FileGallery from '@components/FileGallery';
import { capitalizedText, readyText } from '@helpers/text';
import ShareLayout from '@layouts/ShareLayout';
import { NextPageWithLayout } from '@pages/_app';
import { ssrGraphqlClient } from '@services/graphql/client';
import { getUserSkillForShareQuery } from '@services/graphql/queries/userSkill';
import { UserSkillViewModeEnum, getSkillLevel, SkillLevel } from 'src/definitions/skill';
import { Col, List, message, Progress, Row, Space, Timeline, Typography } from 'antd';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import countryList from 'react-select-country-list';
import styles from './style.module.less';

const ReactViewer = dynamic(() => import('react-viewer'), { ssr: false });

const UserSkillSharePage: NextPageWithLayout = ({ user: userData, skill: userSkillData, error, path }: any) => {
	const [country, setCountry] = useState(null);
	const [level, setLevel] = useState<SkillLevel>();
	const [viewerVisible, setViewerVisible] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	useEffect(() => {
		if (error) message.error(error);
	}, [error]);

	useEffect(() => {
		if (userSkillData) {
			setLevel(getSkillLevel(userSkillData.level));
		}
	}, [userSkillData]);

	useEffect(() => {
		if (!userData?.country) return;

		setCountry(countryList().getLabel(userData.country));
	}, [userData]);

	const pageTitle = `I can ${userSkillData?.skill.name}`;

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="keywords" content="cv,resume,portfolio,profile" />
				<meta name="description" content={`The page about ${userData?.fullName} unique skill`} />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:type" content="article" />
				<meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL + path} />
				<meta property="og:image" content={userData?.avatar} />
			</Head>
			<div className={styles.container}>
				<Row>
					<Col xs={{ span: 24 }} lg={{ span: 24 }}>
						<Space direction="vertical" size={40} style={{ width: '100%' }}>
							<Row className={styles.welcomeSection}>
								<Col>
									Hello,
									<br />
									{!!userData?.fullName && (
										<>
											My name is <strong>{userData?.fullName}</strong>
										</>
									)}
									{!!country && (
										<>
											.
											<br />
											I&apos;m from {country}
										</>
									)}
									{!!userData?.age ? ` and I'm ${userData?.age} years old.` : '.'}
								</Col>
								<Col>
									{userData?.avatar && (
										<img
											src={userData.avatar}
											alt={'avatar'}
											title={`${userData.fullName} photo`}
											style={{ maxHeight: '200px' }}
										/>
									)}
								</Col>
							</Row>

							<Space direction="vertical" className={styles.titleSection}>
								<h1>
									<div>I can</div>
									<h2 className={styles.title}>{capitalizedText(userSkillData?.skill.name)}</h2>
								</h1>
								<div>
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
								</div>
							</Space>

							{userSkillData?.description?.length > 0 && (
								<div className={styles.descriptionSection}>
									<p className={styles.description}>{userSkillData?.description ? readyText(userSkillData?.description) : ''}</p>
								</div>
							)}

							<div className={styles.toolsSection}>
								<div className={styles.headerContainer}>
									<h2>I use for this</h2>
								</div>
								{userSkillData?.tools?.length > 0 && (
									<List
										className={styles.list}
										size="small"
										dataSource={userSkillData?.tools}
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
							<div className={styles.jobsSection}>
								<div className={styles.headerContainer}>
									<h2>I used this skill in the following jobs</h2>
								</div>
								{userSkillData?.jobs?.length > 0 && (
									<Timeline mode="left">
										{userSkillData.jobs.map((item: any, indx: number) => (
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
								)}
							</div>
							<div className={styles.schoolsSection}>
								<div className={styles.headerContainer}>
									<h2>I learned this skill in</h2>
								</div>
								{userSkillData?.schools?.length > 0 && (
									<Timeline mode="left">
										{userSkillData?.schools.map((item: any, indx: number) => (
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
								)}
							</div>
						</Space>
					</Col>
				</Row>
				{userSkillData?.files?.length > 0 && (
					<Row style={{ marginTop: '40px' }}>
						<Col flex={1}>
							<div className={styles.worksSection}>
								<div className={styles.headerContainer}>
									<h2>Examples</h2>
								</div>
								<FileGallery
									fileList={userSkillData.files}
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
					activeIndex={userSkillData?.files
						.filter((i: any) => i.type === 'FILE')
						.findIndex((i: any) => i.id === selectedImage)}
					noToolbar={false}
					noImgDetails
					customToolbar={(toolbar) => {
						return toolbar.filter((tool) => ['download', 'scaleX', 'scaleY'].includes(tool.key) === false);
					}}
					showTotal={false}
					images={userSkillData?.files
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

export async function getServerSideProps(context) {
	const { hashLink } = context.query;
	let props: any = {};

	if (hashLink) {
		const client = ssrGraphqlClient(context.req.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME]);

		const { data, error } = await client
			.query(getUserSkillForShareQuery, {
				hash: hashLink,
			})
			.toPromise();

		props = data?.userSkillForShare;

		if (error) {
			return { notFound: true };
		}
	}

	return { props: { ...props, path: context.req.url } };
}

export default UserSkillSharePage;
