import { useEffect, useState } from 'react';
import { capitalizedText, experienceAsText } from '@helpers/text';
import { searchUserSkillsQuery } from '@services/graphql/queries/userSkill';
import { getSkillLevel, UserSkillViewModeEnum } from 'src/definitions/skill';
import { DeleteOutlined, WarningTwoTone } from '@ant-design/icons';
import {
	Alert,
	AutoComplete,
	Button,
	ConfigProvider,
	Form,
	List,
	message,
	Popconfirm,
	Progress,
	Select,
	Space,
	Tooltip,
	Typography,
} from 'antd';
import { BiLinkAlt, BiWorld } from 'react-icons/bi';
import { FiEyeOff } from 'react-icons/fi';
import { TbArrowsJoin } from 'react-icons/tb';
import { useQuery } from 'urql';
import styles from './style.module.less';

export const AddUserKitForm = ({
	form,
	searchProfessionData,
	onSelectProfession,
	onSearchProfession,
	onChangeProfession,
}: any) => {
	const [userSkillList, setUserSkillList] = useState([]);
	const [userSkillSearchQuery, setUserSkillSearchQuery] = useState(null);

	/** Queries */
	const [{ data: searchUserSkillData }, searchKits] = useQuery({
		query: searchUserSkillsQuery,
		variables: { search: userSkillSearchQuery },
		requestPolicy: 'network-only',
	});

	useEffect(() => {
		if (!form.getFieldValue('userSkills')) {
			setUserSkillList([]);
		}
	}, [form.getFieldValue('userSkills')]);

	useEffect(() => {
		form.setFieldsValue({ userSkills: userSkillList });
	}, [userSkillList]);

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
				name="professionName"
				label="I am"
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
					size="large"
					defaultActiveFirstOption={false}
					showArrow={false}
					filterOption={false}
					placeholder="Engineer or actor or writer..."
					notFoundContent={null}
					onSelect={onSelectProfession}
					onSearch={onSearchProfession}
					onChange={onChangeProfession}
				>
					{searchProfessionData?.professions.map((d: any) => (
						<AutoComplete.Option key={d.id} value={d.name}>
							{d.name}
						</AutoComplete.Option>
					))}
				</AutoComplete>
			</Form.Item>

			<Form.Item name="userSkills" noStyle hidden />
			<Space direction="vertical" style={{ width: '100%' }}>
				<span>This kit includes the following skills</span>
				<ConfigProvider renderEmpty={() => '🤔 Hmm, empty'}>
					<List
						className={styles.list}
						size="small"
						itemLayout="horizontal"
						dataSource={userSkillList}
						bordered={true}
						header={
							<Select
								className={styles.listSelect}
								value={userSkillSearchQuery}
								showSearch
								allowClear
								defaultActiveFirstOption={false}
								showArrow={true}
								filterOption={false}
								placeholder="Select from your skills. Start typing..."
								notFoundContent={null}
								onSelect={(value, option) => {
									const _selectedUserSkill = searchUserSkillData?.userSkills.find((us) => us.id === option.key);
									const _userSkillsList = form.getFieldValue('userSkills');
									if (_userSkillsList.filter((el) => el.id === _selectedUserSkill.id).length === 0) {
										setUserSkillList((state: any) => [_selectedUserSkill, ...state]);
									} else {
										message.info(
											<>
												<strong>{capitalizedText(_selectedUserSkill.skill.name)}</strong> skill is already on the list
											</>,
										);
									}
									setUserSkillSearchQuery(null);
								}}
								onSearch={(value) => setUserSkillSearchQuery(value)}
								onClear={() => setUserSkillSearchQuery(null)}
								onDeselect={() => setUserSkillSearchQuery(null)}
							>
								{searchUserSkillData?.userSkills.map((d: any) => (
									<Select.Option key={d.id} value={d.skill.name}>
										{d.skill.name}
									</Select.Option>
								))}
							</Select>
						}
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
												setUserSkillList((state) => state.filter((record) => record.id !== item.id));
												message.success(
													<>
														<strong>{capitalizedText(item.skill.name)}</strong> skill removed from the list
													</>,
												);
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
				</ConfigProvider>
			</Space>

			<Alert
				showIcon={false}
				icon={null}
				message={
					<>
						Skills kit is a set of your unique skills, using which in combination you perform some useful role.
						<br />
						The name of the kit should describe your type of activity, your role (an example, your profession).
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
