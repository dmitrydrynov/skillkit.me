import { useState } from 'react';
import { capitalizedText, experienceAsText } from '@helpers/text';
import { searchUserSkillsQuery } from '@services/graphql/queries/userSkill';
import { getSkillLevel, UserSkillViewModeEnum } from 'src/definitions/skill';
import { DeleteOutlined, WarningTwoTone } from '@ant-design/icons';
import {
	Alert,
	AutoComplete,
	Button,
	Col,
	Form,
	List,
	Popconfirm,
	Progress,
	Row,
	Space,
	Tooltip,
	Typography,
} from 'antd';
import { BiLinkAlt, BiWorld } from 'react-icons/bi';
import { FiEyeOff } from 'react-icons/fi';
import { TbArrowsJoin } from 'react-icons/tb';
import { useQuery } from 'urql';
import styles from './style.module.less';

export const AddUserKitForm = ({ form, searchSkillData, onSelectSkill, onSearchSkill, onChangeSkill }: any) => {
	const [selectedUserSkill, setSelectedUserSkill] = useState(null);
	let [userSkillSearchQuery, setUserSkillSearchQuery] = useState(null);

	/** Queries */
	let [{ data: searchUserSkillData }, searchKits] = useQuery({
		query: searchUserSkillsQuery,
		variables: { search: userSkillSearchQuery },
		pause: userSkillSearchQuery === null,
		requestPolicy: 'network-only',
	});

	return (
		<Form
			className={styles.form}
			form={form}
			layout="vertical"
			name="form_in_modal"
			initialValues={{ modifier: 'public' }}
			requiredMark={false}
		>
			<Form.Item
				name="kitName"
				label="I am (the kit name)"
				rules={[
					{
						required: true,
						message: 'Please input the skill name!',
					},
				]}
			>
				<AutoComplete
					showSearch
					allowClear
					defaultActiveFirstOption={false}
					showArrow={false}
					filterOption={false}
					placeholder="Engineer or actor or writer..."
					notFoundContent={null}
					onSelect={onSelectSkill}
					onSearch={onSearchSkill}
					onChange={onChangeSkill}
				>
					{searchSkillData?.skills.map((d: any) => (
						<AutoComplete.Option key={d.id} value={d.name}>
							{d.name}
						</AutoComplete.Option>
					))}
				</AutoComplete>
			</Form.Item>

			<Form.Item
				name="skillName"
				label="This kit includes the following skills"
				rules={[
					{
						required: true,
						message: 'Please input the skill name!',
					},
				]}
			>
				<Row align="middle" style={{ width: '100%' }}>
					<Col flex="auto">
						<AutoComplete
							showSearch
							allowClear
							defaultActiveFirstOption={false}
							showArrow={false}
							filterOption={false}
							placeholder="Select from your skills. Start typing..."
							notFoundContent={null}
							onSelect={(value, option) => setSelectedUserSkill(option.key)}
							onSearch={(value) => setUserSkillSearchQuery(value)}
							onChange={(value, option) => setSelectedUserSkill(null)}
						>
							{searchUserSkillData?.userSkills.map((d: any) => (
								<AutoComplete.Option key={d.id} value={d.skill.name}>
									{d.skill.name}
								</AutoComplete.Option>
							))}
						</AutoComplete>
					</Col>
					<Col flex="none" offset={1}>
						<Button type="primary">Add</Button>
					</Col>
				</Row>
			</Form.Item>

			<List
				className={styles.list}
				size="small"
				itemLayout="horizontal"
				renderItem={(item: any) => {
					const level = getSkillLevel(item.level);

					return (
						<List.Item
							className={styles.listItem}
							actions={[
								<Popconfirm
									key="delete-userkit"
									title="Are you sure to delete this skills kit?"
									onConfirm={() => {
										// handleDeleteSubSkill(item);
									}}
									okText="Yes"
									cancelText="No"
									icon={<WarningTwoTone />}
								>
									<Button key="editItemButtons" className="editItemButtons" size="small">
										<DeleteOutlined />
									</Button>
								</Popconfirm>,
							]}
						>
							<List.Item.Meta
								avatar={
									<Tooltip title={level.description}>
										<Progress
											type="circle"
											percent={level.index * 20}
											width={24}
											showInfo={false}
											strokeColor={level.color}
											strokeWidth={12}
										/>
									</Tooltip>
								}
								title={
									<div style={{ lineHeight: 'initial' }}>
										<Space align="center">
											{item.isComplexSkill && (
												<Tooltip title="This is complex skill">
													<TbArrowsJoin color="#adadad" style={{ display: 'block' }} />
												</Tooltip>
											)}
											<Typography.Text strong>{capitalizedText(item.skill.name)}</Typography.Text>
										</Space>
										<br />
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>
											{experienceAsText(item.experience)}
										</Typography.Text>
									</div>
								}
							/>
							<div>
								{
									<>
										{item.viewMode === UserSkillViewModeEnum.ONLY_ME && (
											<Tooltip title="View mode: only me">
												<FiEyeOff />
											</Tooltip>
										)}
										{item.viewMode === UserSkillViewModeEnum.BY_LINK && (
											<Tooltip title="View mode: by link">
												<BiLinkAlt />
											</Tooltip>
										)}
										{item.viewMode === UserSkillViewModeEnum.EVERYONE && (
											<Tooltip title="View mode: everyone">
												<BiWorld />
											</Tooltip>
										)}
									</>
								}
							</div>
						</List.Item>
					);
				}}
			/>

			<Alert
				showIcon={false}
				icon={null}
				message={
					<>
						Skills kit is a set of your unique skills, using which in combination you perform some useful role.
						<br />
						The name of the kit should describe your type of activity, your role.
						<br />
						<br />
						Examples:
						<br />- I&apos;m a <strong>therapist</strong>. I can diagnose a cold in children, prescribe treatment for colds,
						take temperature.
						<br />- I&apos;m a <strong>computer hardware engineer</strong>. I can code and program, develop hardware
						blueprints.
						<br />- I&apos;m a <strong>nanny</strong>. I can cook, play hide and seek, put the baby to sleep.
						<br />
					</>
				}
				banner
			/>
		</Form>
	);
};
