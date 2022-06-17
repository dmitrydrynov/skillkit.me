import { ReactElement, useMemo, useState } from 'react';
import FileGallery from '@components/FileGallery';
import SendEmailModal from '@components/modals/SendEmailModal';
import { capitalizedText, readyText } from '@helpers/text';
import ShareLayout from '@layouts/ShareLayout';
import { NextPageWithLayout } from '@pages/_app';
import { ssrGraphqlClient } from '@services/graphql/client';
import { getUserSkillForShareQuery } from '@services/graphql/queries/userSkill';
import { UserSkillViewModeEnum, getSkillLevel } from 'src/definitions/skill';
import { Col, Progress, Row, Button, Space, Timeline, Badge, Popover, message } from 'antd';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { BiMailSend } from 'react-icons/bi';
import { FaInfoCircle } from 'react-icons/fa';
import { FiMail, FiSmartphone } from 'react-icons/fi';
import countryList from 'react-select-country-list';
import styles from './style.module.less';

const ReactViewer = dynamic(() => import('react-viewer'), { ssr: false });

const UserSkillSharePage: NextPageWithLayout = ({
	user: userData,
	skill: userSkillData,
	error,
	path,
	hashLink,
}: any) => {
	const country = useMemo(() => (userData?.country ? countryList().getLabel(userData.country.toLowerCase()) : null), []);
	const level = getSkillLevel(userSkillData.level);
	const [viewerVisible, setViewerVisible] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [visibleSendEmailModal, setVisibleSendEmailModal] = useState(false);

	const experience = (): number => {
		if (userSkillData.experience) {
			return userSkillData.experience.years * 12 + userSkillData.experience.months;
		}

		return 0;
	};

	return (
		<>
			<Head>
				<title>I can {userSkillData?.skill.name}</title>
				<meta name="keywords" content="cv,resume,portfolio,profile" />
				<meta name="description" content={`The page about ${userData?.fullName} unique skill`} />
				<meta property="og:title" content={`I can ${userSkillData?.skill.name}`} key="og:title" />
				<meta property="og:description" content={`I can ${userSkillData?.skill.name}`} key="og:description" />
				<meta property="og:type" content="article" />
				<meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL + path} />
				<meta property="og:image" content={userData.avatar + '?h=200'} />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:image" content={userData.avatar + '?h=200'} />
				<meta name="twitter:title" content={`I can ${userSkillData?.skill.name}`} />
				<meta name="twitter:description" content={`The page about ${userData?.fullName} unique skill`} />
				<meta name="twitter:author" content="@DmirtyDrynov" />
				{userSkillData.viewMode !== UserSkillViewModeEnum.EVERYONE && (
					<>
						<meta key="robots" name="robots" content="noindex,follow" />
						<meta key="googlebot" name="googlebot" content="noindex,follow" />
					</>
				)}
			</Head>
			<div className={styles.container}>
				<Row>
					<Col xs={{ span: 24, order: 1 }} md={{ span: 6, order: 2 }} style={{ textAlign: 'center' }}>
						<Space direction="vertical" size="middle" className={styles.contactsAndPhoto}>
							{userData?.avatar && (
								<>
									<img
										className={styles.avatar}
										src={userData.avatar + '?h=200'}
										alt={'avatar'}
										title={`${userData.fullName} photo`}
									/>

									<div className={styles.contacts}>
										{false && <h3>My contacts</h3>}
										{false && userData?.email?.length > 0 && (
											<Row align="middle" justify="center">
												<FiMail size={16} style={{ marginRight: '8px' }} /> {userData.email}
											</Row>
										)}
										{false && userData?.phone?.length > 0 && (
											<Row align="middle" justify="center">
												<FiSmartphone size={16} style={{ marginRight: '8px' }} /> {userData?.phone}
											</Row>
										)}
									</div>
								</>
							)}

							<Button
								type="primary"
								onClick={() => {
									setVisibleSendEmailModal(true);
								}}
							>
								<BiMailSend size={24} style={{ marginRight: '8px' }} /> Write me
							</Button>
						</Space>
					</Col>
					<Col xs={{ span: 24, order: 2 }} md={{ span: 18, order: 1 }}>
						<Space direction="vertical" size={40} style={{ width: '100%' }}>
							<div className={styles.welcomeSection}>
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
							</div>

							<Space direction="vertical" className={styles.titleSection}>
								<h1>
									<div>I can</div>
									<div className={styles.title}>{capitalizedText(userSkillData?.skill.name)}</div>
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
								{experience() >= 12 && <p>Work experience more than {Math.floor(experience() / 12)} year(s)</p>}
								{experience() == 0 && <p>I haven&apos;t any experience yet</p>}
								{experience() > 0 && experience() < 12 && <p>Work experience a little less than a year</p>}
							</Space>

							{userSkillData?.description?.length > 0 && (
								<div className={styles.descriptionSection}>
									<p className={styles.description}>{userSkillData?.description ? readyText(userSkillData?.description) : ''}</p>
								</div>
							)}

							{userSkillData?.tools?.length > 0 && (
								<div className={styles.toolsSection}>
									<div className={styles.headerContainer}>
										<h2>I use for this</h2>
									</div>
									<Space className={styles.list} size="middle">
										{userSkillData?.tools.map((item: any, idx: number) =>
											item.description ? (
												<Badge
													count={
														<Popover
															content={item.description}
															overlayStyle={{
																maxWidth: '50vw',
															}}
														>
															<FaInfoCircle color="#f558a1" />
														</Popover>
													}
													key={idx}
												>
													<div className={styles.listItem}>{item.title}</div>
												</Badge>
											) : (
												<div className={styles.listItem}>{item.title}</div>
											),
										)}
									</Space>
								</div>
							)}
							{userSkillData?.jobs?.length > 0 && (
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
							)}
							{userSkillData?.schools?.length > 0 && (
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
							)}
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
			<SendEmailModal
				hash={hashLink}
				visible={visibleSendEmailModal}
				onSend={() => {
					message.success('Your letter sent succesfully');
					setVisibleSendEmailModal(false);
				}}
				onCancel={() => {
					setVisibleSendEmailModal(false);
				}}
			/>
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

	return { props: { ...props, path: context.req.url, hashLink } };
}

export default UserSkillSharePage;
