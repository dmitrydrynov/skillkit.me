/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from 'react';
import Icon, { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Form, FormInstance, Input, Popconfirm, Rate, Row, Space } from 'antd';
import BraftEditor, { ControlType } from 'braft-editor';
import styles from './style.module.less';

type UserToolBlockParams = {
	form?: FormInstance;
	tools?: any[];
	onDelete(toolId: string | null, index: number): Promise<boolean | undefined>;
	onAdd(): void;
};

const ToolLevelSvg = () => (
	<svg width="1em" height="1em" viewBox="0 0 29 29" fill="currentColor">
		<rect width="29" height="29" />
	</svg>
);
const ToolLevelIcon = (props: any) => <Icon component={ToolLevelSvg} {...props} />;

const UserToolBlock = ({ form, tools, onDelete, onAdd }: UserToolBlockParams) => {
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
	const userToolDesc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
	const [titles, setTitles] = useState<string[] | undefined>([]);
	const [activeKey, setActiveKey] = useState<number>();

	useEffect(() => {
		if (tools) {
			setTitles(tools?.map((d: UserTool) => d.title));
		}
	}, []);

	const handleUpdateTitle = (event: ChangeEvent<HTMLInputElement>, idx: number) => {
		let updatedTitles = [...titles];
		updatedTitles[idx] = form?.getFieldValue(['tools', idx, 'title']);

		setTitles(updatedTitles);
	};

	const handleAdd = () => {
		if (tools) {
			setActiveKey(tools.length);
		}
		onAdd();
	};

	const handleItemDelete = async (e: any, recordId: string, idx: number) => {
		e.preventDefault();
		e.stopPropagation();

		if (await onDelete(recordId, idx)) {
			setTitles(titles?.filter((d, i) => i !== idx));
		}
	};

	const deleteButton = (recordId: string, idx: number) => (
		<Popconfirm
			placement="left"
			title="Are you sure to delete this school?"
			onConfirm={(e) => handleItemDelete(e, recordId, idx)}
			onCancel={(e) => e?.stopPropagation()}
		>
			<Button
				type="text"
				size="small"
				className={styles.deleteButton}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<DeleteOutlined />
			</Button>
		</Popconfirm>
	);

	const toolSection = (tool: any, idx: number) => {
		return (
			<Collapse.Panel
				header={(titles && titles[idx]) || '(Not specified)'}
				className={styles.toolSection}
				key={idx}
				extra={deleteButton(tool.id, idx)}
			>
				<Form.Item name={['tools', idx, 'id']} hidden={true} />

				<Row>
					<Col span={14}>
						<Form.Item
							name={['tools', idx, 'title']}
							label="Title"
							rules={[{ required: true, message: 'Please input the field!' }]}
						>
							<Input onChange={(event) => handleUpdateTitle(event, idx)} />
						</Form.Item>
					</Col>
					<Col span={8} offset={2}>
						<Form.Item
							name={['tools', idx, 'level']}
							label="Level"
							rules={[{ required: true, message: 'Please input the field!' }]}
						>
							<Rate allowClear={false} tooltips={userToolDesc} character={<ToolLevelIcon />} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name={['tools', idx, 'description']} label="Description" style={{ marginBottom: 0 }}>
					<BraftEditor
						className={styles.textEditor}
						controls={controls}
						language="en"
						contentClassName={styles.textEditorContent}
					/>
				</Form.Item>
			</Collapse.Panel>
		);
	};

	return (
		<div className={styles.section}>
			<h4>Tools, services, software</h4>
			<p>What tools do you use when using this skill?</p>
			<Space direction="vertical" style={{ width: '100%' }}>
				{!!tools?.length && (
					<Collapse
						accordion
						expandIconPosition="right"
						activeKey={activeKey}
						onChange={(key: any) => setActiveKey(key)}
					>
						{tools?.map(toolSection)}
					</Collapse>
				)}

				<Button size="small" type="text" onClick={handleAdd}>
					<PlusOutlined /> Add tool
				</Button>
			</Space>
		</div>
	);
};

export default UserToolBlock;
