import { skillLevelsList } from 'src/definitions/skill';
import { Alert, AutoComplete, Col, Form, Row, Select, Tooltip } from 'antd';
import Image from 'next/image';
import styles from './style.module.less';

export const AddUserSkillForm = ({ form, searchSkillData, onSelectSkill, onSearchSkill, onChangeSkill }: any) => {
	return (
		<Form
			className={styles.form}
			form={form}
			layout="vertical"
			name="form_in_modal"
			initialValues={{ modifier: 'public' }}
			requiredMark={false}>
			<Row>
				<Col xs={{ span: 24 }} sm={{ span: 14 }}>
					<Form.Item
						name="skillName"
						label="What can you do?"
						rules={[
							{
								required: true,
								message: 'Please input the skill name!',
							},
						]}>
						<AutoComplete
							showSearch
							allowClear
							defaultActiveFirstOption={false}
							showArrow={false}
							filterOption={false}
							placeholder="Make something ..."
							notFoundContent={null}
							onSelect={onSelectSkill}
							onSearch={onSearchSkill}
							onChange={onChangeSkill}>
							{searchSkillData?.skills.map((d: any) => (
								<AutoComplete.Option key={d.id} value={d.name}>
									{d.name}
								</AutoComplete.Option>
							))}
						</AutoComplete>
					</Form.Item>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8, offset: 2 }}>
					<Form.Item name="level" label="Level" rules={[{ required: true, message: 'Please input the email!' }]}>
						<Select placeholder="Select">
							{skillLevelsList.map((item, indx) => (
								<Select.Option key={indx.toString()} value={item.label.toLowerCase()}>
									<Tooltip title={item.description} placement="right">
										<Image src={item.icon} alt="" /> {item.label}
									</Tooltip>
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>
			<Alert
				showIcon={false}
				icon={null}
				message={
					<>
						The name of your skill should be indicated as follows: the first word is a predicate (verb), the second is a
						object (noun), the others are an attribute (the specifics of your skill).
						<br />
						<br />
						Examples:
						<br />
						- Develop web applications for healthcare
						<br />
						- Find professionals for game development industry
						<br />
						- Play on the guitar the music of Jimi Hendrix
						<br />
					</>
				}
				banner
			/>
		</Form>
	);
};
