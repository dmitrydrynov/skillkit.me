import React, { ReactElement, useState, useEffect, createRef } from 'react';
import { InlineEdit } from '@components/InlineEdit';
import SkillEditorMenu from '@components/menus/SkillEditorMenu';
import UserToolBlock from '@components/modals/AddUserSkillModal/UserToolBlock';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { createSkillMutation, searchSkillsQuery } from '@services/graphql/queries/skill';
import { editUserSkillMutation, getUserSkillQuery } from '@services/graphql/queries/userSkill';
import { getSkillLevel, SkillLevel, skillLevelsList } from 'src/definitions/skill';
import { PlusOutlined } from '@ant-design/icons';
import {
	AutoComplete,
	Button,
	Col,
	Input,
	message,
	Progress,
	Row,
	Select,
	Skeleton,
	Space,
	Table,
	Tooltip,
} from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const SkillEditorPage: NextPageWithLayout = () => {
	const router = useRouter();
	const skillRef = createRef<RefSelectProps>();
	const { skillId } = router.query;
	const [{ data: userSkillData, fetching: userSkillFetching }] = useQuery({
		query: getUserSkillQuery,
		variables: { id: skillId },
		pause: !skillId,
		requestPolicy: 'network-only',
	});
	const [, updateUserSkillData] = useMutation(editUserSkillMutation);
	const [experience, setExperience] = useState(0);
	const [level, setLevel] = useState<SkillLevel>(skillLevelsList[0]);
	const [tools, setTools] = useState([]);
	const [schools, setSchools] = useState([]);
	const [jobs, setJobs] = useState([]);
	const [works, setWorks] = useState([]);
	const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
	let [skillSearchQuery, setsSkillSearchQuery] = useState('');
	let [{ data: searchSkillData }, searchSkills] = useQuery({
		query: searchSkillsQuery,
		variables: { search: skillSearchQuery },
		pause: true,
		requestPolicy: 'network-only',
	});
	const [, addSkill] = useMutation(createSkillMutation);
	const [visibleToolModal, setVisibleToolModal] = useState(false);

	useEffect(() => {
		if (!userSkillData) {
			return;
		}

		setExperience(5);
		setLevel(getSkillLevel(userSkillData.userSkill.level));
		handleChangeInlineInput(userSkillData.userSkill.title);
	}, [userSkillData]);

	useEffect(() => {
		(async () => {
			await searchSkills();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skillSearchQuery]);

	const prepareSkillName = () => {
		if (!userSkillData) {
			return '';
		}

		const { name } = userSkillData?.userSkill.skill;
		return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
	};

	const emptyData = (dataName = 'data') => <span className={styles.descriptionEmpty}>(Empty {dataName})</span>;

	const [width, setWidth] = useState(userSkillData?.userSkill.skill.name.length);

	const handleChangeInlineInput = (value) => {
		const minWidth = 20;
		setWidth(value?.length > minWidth ? value?.length + 1 : minWidth);
	};

	const handleUserSkillUpdate = async (values: any) => {
		let formatedValues = values;

		Object.entries(values).map(([key]) => {
			if (key === 'skillId') {
				formatedValues[key] = +selectedSkillId;
			}
		});

		const reponse = await updateUserSkillData({ recordId: skillId, data: formatedValues });

		if (reponse.error) {
			message.error(reponse.error.message);
			return;
		}

		message.success('User skill updated!');
	};

	const readyDescription = (text: string) => {
		return text.split('\n').map((item, key) => {
			return (
				<React.Fragment key={key}>
					{item}
					<br />
				</React.Fragment>
			);
		});
	};

	const handleAddNewSkill = async () => {
		try {
			const { data, error } = await addSkill({
				name: skillSearchQuery,
			});

			if (error) {
				message.error(error);
				return;
			}

			searchSkillData?.skills.push(data.createSkill);
			setSelectedSkillId(data.createSkill.id);
		} catch (error: any) {
			message.error(error.message);
		}
	};

	const handleAddTool = () => {
		setVisibleToolModal(true);
	};

	return (
		<>
			<Head>
				<title>Skill Editor - SkillKit</title>
			</Head>
			<Space direction="vertical" size={40} className={styles.container}>
				<div className={styles.header}>
					<UserToolBlock visible={visibleToolModal} onSave={() => {}} onCancel={() => setVisibleToolModal(false)} />
					<Row align="middle">
						<Col flex={1}>
							<div className={styles.titleAbove}>I can</div>
							{userSkillFetching ? (
								<Skeleton.Button style={{ width: '450px', height: '30px', marginBottom: '0.5em' }} active={true} />
							) : (
								<InlineEdit
									name="skillId"
									initialValue={prepareSkillName()}
									onSave={handleUserSkillUpdate}
									viewMode={<h2 className={styles.title}>{prepareSkillName()}</h2>}
									editMode={
										<AutoComplete
											ref={skillRef}
											showSearch
											allowClear
											className={styles.titleInput}
											style={{ width: width + 'ch' }}
											defaultActiveFirstOption={false}
											showArrow={false}
											filterOption={false}
											placeholder="To do something ..."
											notFoundContent={null}
											onChange={handleChangeInlineInput}
											onSelect={(value, option) => setSelectedSkillId(option.key as number)}
											onSearch={(value: string) => setsSkillSearchQuery(value)}
										>
											{searchSkillData?.skills.map((d: any) => (
												<AutoComplete.Option key={d.id} value={d.name}>
													{d.name}
												</AutoComplete.Option>
											))}
											{skillSearchQuery.length &&
												searchSkillData?.skills.filter((d: { name: string }) => {
													return skillSearchQuery.toLowerCase().trim() === d.name.toLowerCase();
												}).length === 0 && (
													<Select.Option
														disabled
														key={'emptyOption'}
														value={''}
														style={{
															paddingBottom: 0,
															paddingTop: 0,
														}}
													>
														<Button type="link" style={{ padding: 0 }} onClick={handleAddNewSkill}>
															<PlusOutlined /> Add new: &ldquo;{skillSearchQuery}&ldquo;
														</Button>
													</Select.Option>
												)}
										</AutoComplete>
									}
								/>
							)}
						</Col>
						<Col>
							<InlineEdit
								name="level"
								initialValue={level.label.toUpperCase()}
								onSave={handleUserSkillUpdate}
								viewMode={
									<Tooltip title={level.description}>
										<div className={styles.levelName}>
											<strong>{level.label}</strong> level
										</div>
										<Progress
											className={styles.progressBar}
											percent={level.index * 20}
											steps={5}
											status="active"
											strokeColor={level.color}
											showInfo={false}
										/>
									</Tooltip>
								}
								editMode={
									<Select placeholder="Select" style={{ width: '150px' }}>
										{skillLevelsList.map((item, indx) => (
											<Select.Option key={indx.toString()} value={item.label.toUpperCase()}>
												<Tooltip title={item.description} placement="right">
													<Image src={item.icon} alt="" /> {item.label}
												</Tooltip>
											</Select.Option>
										))}
									</Select>
								}
							/>
							<p>
								{experience > 0 ? `Work experience more than ${experience} year(s)` : "I haven't any experience yet"}
							</p>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<InlineEdit
								name="description"
								initialValue={userSkillData?.userSkill.description}
								onSave={handleUserSkillUpdate}
								viewMode={
									<p className={styles.description}>
										{userSkillData?.userSkill.description
											? readyDescription(userSkillData?.userSkill.description)
											: emptyData('description')}
									</p>
								}
								editMode={
									<Input.TextArea
										autoSize={{ minRows: 4, maxRows: 12 }}
										style={{ width: '100%', height: 'auto' }}
										showCount
										maxLength={500}
										placeholder="Start typing"
										defaultValue={userSkillData?.userSkill.description}
									/>
								}
							/>
						</Col>
					</Row>
				</div>
				<div className={styles.toolsSection}>
					<div className={styles.headerContainer}>
						<h3>Tools</h3>
						<Button type="ghost" shape="circle" size="small" icon={<PlusOutlined />} onClick={handleAddTool} />
					</div>
					{tools.length ? <Table></Table> : emptyData('tools')}
				</div>
				<div className={styles.schoolsSection}>
					<div className={styles.headerContainer}>
						<h3>History of skill learning</h3>
						<Button type="ghost" shape="circle" size="small" icon={<PlusOutlined />} />
					</div>
					{schools.length ? <Table></Table> : emptyData('schools')}
				</div>
				<div className={styles.jobsSection}>
					<div className={styles.headerContainer}>
						<h3>Work experience</h3>
						<Button type="ghost" shape="circle" size="small" icon={<PlusOutlined />} />
					</div>
					{jobs.length ? <Table></Table> : emptyData('jobs')}
				</div>
				<div className={styles.worksSection}>
					<div className={styles.headerContainer}>
						<h3>Work examples</h3>
						<Button type="ghost" shape="circle" size="small" icon={<PlusOutlined />} />
					</div>
					{works.length ? <Table></Table> : emptyData('works')}
				</div>
			</Space>
		</>
	);
};

SkillEditorPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout title="Skill Editor" siderMenu={<SkillEditorMenu />}>
		{page}
	</ProtectedLayout>
);

export default SkillEditorPage;
