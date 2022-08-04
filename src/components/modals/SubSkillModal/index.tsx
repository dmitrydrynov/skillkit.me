import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { capitalizedText } from '@helpers/text';
import { searchSkillsQuery } from '@services/graphql/queries/skill';
import { addSubSkillsMutation, createUserSkillMutation, userSkillsQuery } from '@services/graphql/queries/userSkill';
import { Modal, Spin, Tabs, Form, message, TreeSelect } from 'antd';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';
import { AddUserSkillForm } from '../AddUserSkillModal/AddUserSkillForm';

type _ModalParams = {
	onSave(action: 'create' | 'update', data?: any): void;
	onCancel(): void;
	visible?: boolean;
	userSkill: any;
};

type _FormData = {
	subSkills?: number[];
	level?: string;
	skillName?: string;
};

enum _ActionEnum {
	'AddNew',
	'SelectFromList',
}

const SubSkillModal = ({ onSave, onCancel, userSkill, visible = false }: _ModalParams) => {
	/** Local variables */
	const [form] = Form.useForm();
	/** Local state */
	const [selectedAction, setSelectedAction] = useState(_ActionEnum.SelectFromList);
	const [submitting, setSubmitting] = useState(false);
	const [skillSearchQuery, setSkillSearchQuery] = useState(null);
	const [selectedSkillId, setSelectedSkillId] = useState<number>();
	const [userSkillsList, setUserSkillsList] = useState([]);
	/** Queries */
	let [{ data: searchSkillData }, searchSkills] = useQuery({
		query: searchSkillsQuery,
		variables: { search: skillSearchQuery },
		pause: skillSearchQuery === null,
		requestPolicy: 'network-only',
	});
	const [userSkills] = useQuery({
		query: userSkillsQuery,
		variables: {
			where: {
				id: { notIn: [userSkill?.id].concat(userSkill?.subSkills?.map((r) => r.id)) },
				isDraft: false,
			},
		},
		pause: !visible || !userSkill,
		requestPolicy: 'network-only',
	});
	/** Mutations */
	const [addUserSkillResponse, addUserSkill] = useMutation(createUserSkillMutation);
	const [, addSubSkills] = useMutation(addSubSkillsMutation);

	useEffect(() => {
		form.resetFields();
		setSelectedAction(_ActionEnum.SelectFromList);
		setSelectedSkillId(null);
		setSkillSearchQuery(null);
	}, [visible]);

	useEffect(() => {
		if (!skillSearchQuery) return;

		(async () => {
			await searchSkills();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skillSearchQuery]);

	useEffect(() => {
		if (userSkills.data) {
			setUserSkillsList(prepareUserSkillData(userSkills.data.userSkills));
		}
	}, [userSkills]);

	const prepareUserSkillData = (_data: any[]) => {
		if (_data)
			return _data.map((item: any) => {
				return {
					title: capitalizedText(item.skill.name),
					value: item.id,
					key: item.id,
				};
			});

		return [];
	};

	const handleSave = async () => {
		try {
			setSubmitting(true);

			if (selectedAction == _ActionEnum.SelectFromList) {
				const { subSkills }: _FormData = await form.validateFields();
				const { data, error } = await addSubSkills({
					userSkillId: userSkill.id,
					subSkills,
				});

				if (error) {
					message.error(getErrorMessage(error));
					setSubmitting(false);
					return;
				}

				onSave('update');
				form.resetFields();
				setSubmitting(false);
			}

			if (selectedAction == _ActionEnum.AddNew) {
				const { skillName, level }: _FormData = await form.validateFields();

				const { data: _newUserSkillData, error: _newUserSkillError } = await addUserSkill({
					skillId: selectedSkillId,
					skillName: skillName.trim().toLowerCase(),
					level: level.toUpperCase(),
				});

				if (_newUserSkillError) {
					setSelectedSkillId(null);
					setSkillSearchQuery(null);
					addUserSkillResponse.fetching = false;

					const err = _newUserSkillError.message?.split(']');
					form.setFields([
						{
							name: 'skillName',
							errors: [err[1].trim()],
						},
					]);

					setSubmitting(false);
					return;
				}

				const { data: _addSubSkillsData, error: _addSubSkillsError } = await addSubSkills({
					userSkillId: userSkill.id,
					subSkills: [_newUserSkillData.createUserSkill.id],
				});

				if (_addSubSkillsError) {
					message.error(getErrorMessage(_addSubSkillsError));
					setSubmitting(false);
					return;
				}

				// gtmEvent('NewUserSkillEvent', { skillName, skillLevel: level });

				setSkillSearchQuery(null);
				setSelectedSkillId(null);
				onSave('create');
				form.resetFields();
				setSubmitting(false);
			}
		} catch (error) {
			message.error(error.message);
			setSubmitting(false);
		}
	};

	return (
		<Modal
			title="Add subskills"
			visible={visible}
			onOk={() => handleSave()}
			onCancel={() => {
				onCancel();
				form.resetFields();
			}}
			width={650}
			centered
			okText="Save"
			maskClosable={false}
			className={styles.modal}
			destroyOnClose={true}
			confirmLoading={submitting}
			okButtonProps={{ disabled: selectedAction == _ActionEnum.SelectFromList && userSkillsList.length === 0 }}>
			<Spin spinning={submitting}>
				<Form form={form} layout="vertical" name="add_example_link_form" requiredMark={false}>
					<Tabs
						defaultActiveKey={_ActionEnum.SelectFromList.toString()}
						tabPosition="left"
						className={styles.tabs}
						onTabClick={(selectedKey) => {
							setSelectedAction(selectedKey as unknown as _ActionEnum);
							form.resetFields();
						}}>
						<Tabs.TabPane tab={`Select from list`} key={_ActionEnum.SelectFromList}>
							{selectedAction == _ActionEnum.SelectFromList && (
								<>
									<Form.Item
										name="subSkills"
										label="Your skills"
										rules={[
											{
												required: true,
												message: 'This field is required.',
											},
										]}>
										<TreeSelect
											treeData={userSkillsList}
											disabled={userSkillsList.length === 0}
											treeCheckable
											allowClear
											showSearch
											placement="topLeft"
											showArrow={false}
											placeholder={userSkillsList.length === 0 ? 'No skills available' : 'Please select'}
											filterTreeNode={(search, item) => {
												const title = item.title as string;
												return title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
											}}
										/>
									</Form.Item>
								</>
							)}
						</Tabs.TabPane>
						<Tabs.TabPane tab={`Add new`} key={_ActionEnum.AddNew}>
							{selectedAction == _ActionEnum.AddNew && (
								<>
									<AddUserSkillForm
										form={form}
										searchSkillData={searchSkillData}
										onSelectSkill={(value, option) => setSelectedSkillId(option.key as number)}
										onSearchSkill={(value: string) => setSkillSearchQuery(value)}
										onChangeSkill={() => setSelectedSkillId(null)}
									/>
								</>
							)}
						</Tabs.TabPane>
					</Tabs>
				</Form>
			</Spin>
		</Modal>
	);
};

export default SubSkillModal;
