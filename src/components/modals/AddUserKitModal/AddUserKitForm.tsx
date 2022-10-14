import { useEffect, useState } from 'react';
import { Alert, AutoComplete, Form } from 'antd';
import styles from './style.module.less';

export const AddUserKitForm = ({
	form,
	searchProfessionData,
	onSelectProfession,
	onSearchProfession,
	onChangeProfession,
}: any) => {
	const [userSkillList, setUserSkillList] = useState([]);

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
