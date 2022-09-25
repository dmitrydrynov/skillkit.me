import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { capitalizedText } from '@helpers/text';
import { searchSkillsQuery } from '@services/graphql/queries/skill';
import { addUserSkillsMutation, createUserKitMutation } from '@services/graphql/queries/userKit';
import { createUserSkillMutation, userSkillsQuery } from '@services/graphql/queries/userSkill';
import { Modal, Spin, Tabs, Form, message, TreeSelect } from 'antd';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';
import { AddUserSkillForm } from '../AddUserSkillModal/AddUserSkillForm';

type _ModalParams = {
	onSave(data?: any): void;
	onCancel(): void;
	visible?: boolean;
	userKit: any;
};

type _FormData = {
	userSkillIds?: number[];
	skillName?: string;
	level?: string;
};

enum _ActionEnum {
	'AddNew',
	'SelectFromList',
}

const UserSkillForKitModal = ({ onSave, onCancel, userKit, visible = false }: _ModalParams) => {
	/** Local variables */
	const [form] = Form.useForm();
	/** Local state */
	const [selectedAction, setSelectedAction] = useState(_ActionEnum.SelectFromList);
	const [submitting, setSubmitting] = useState(false);
	const [skillSearchQuery, setSkillSearchQuery] = useState(null);
	const [selectedSkillId, setSelectedSkillId] = useState<number>();
	const [userSkillList, setUserSkillList] = useState([]);
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
				id: { notIn: userKit?.userSkills?.map((r) => r.id) },
				isDraft: false,
			},
		},
		pause: !visible || !userKit,
		requestPolicy: 'network-only',
	});
	/** Mutations */
	const [addUserSkillResponse, addUserSkill] = useMutation(createUserSkillMutation);
	const [, addUserSkillsForKit] = useMutation(addUserSkillsMutation);

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
		if (userSkills) {
			setUserSkillList(prepareUserSkillData(userSkills.data?.userSkills));
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
				const { userSkillIds }: _FormData = await form.validateFields();
				const { data, error } = await addUserSkillsForKit({
					recordId: userKit.id,
					userSkills: userSkillIds,
				});

				if (error) {
					message.error(getErrorMessage(error));
					setSubmitting(false);
					return;
				}

				onSave();
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

				const { data: _addUserSkillsData, error: _addUserSkillsError } = await addUserSkillsForKit({
					recordId: userKit.id,
					userSkills: [_newUserSkillData.createUserSkill.id],
				});

				if (_addUserSkillsError) {
					message.error(getErrorMessage(_addUserSkillsError));
					setSubmitting(false);
					return;
				}

				// gtmEvent('NewUserSkillEvent', { skillName, skillLevel: level });

				setSkillSearchQuery(null);
				setSelectedSkillId(null);
				onSave();
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
			title="Add user skills"
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
			okButtonProps={{ disabled: selectedAction == _ActionEnum.SelectFromList && userSkillList.length === 0 }}
		>
			<Spin spinning={submitting}>
				<Form form={form} layout="vertical" name="add_example_link_form" requiredMark={false}>
					<Tabs
						defaultActiveKey={_ActionEnum.SelectFromList.toString()}
						tabPosition="left"
						className={styles.tabs}
						onTabClick={(selectedKey) => {
							setSelectedAction(selectedKey as unknown as _ActionEnum);
							form.resetFields();
						}}
					>
						<Tabs.TabPane tab={`Select from list`} key={_ActionEnum.SelectFromList}>
							{selectedAction == _ActionEnum.SelectFromList && (
								<>
									<Form.Item
										name="userSkillIds"
										label="Your skills"
										rules={[
											{
												required: true,
												message: 'This field is required.',
											},
										]}
									>
										<TreeSelect
											treeData={userSkillList}
											disabled={userSkillList.length === 0}
											treeCheckable
											allowClear
											showSearch
											placement="topLeft"
											showArrow={false}
											placeholder={userSkillList.length === 0 ? 'No skills available' : 'Please select'}
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

export default UserSkillForKitModal;
