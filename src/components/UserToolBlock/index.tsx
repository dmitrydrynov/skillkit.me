/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { skillLevelsList } from 'src/definitions/skill';
import Icon, { BorderOutlined, DeleteOutlined, FireFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Divider, Form, Input, Rate, Row, Select, Space, Tooltip } from 'antd';
import { ControlType } from 'braft-editor';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from './UserToolBlock.module.less';

type UserToolBlockParams = {
	visible?: boolean;
	tools?: any[];
	onDelete(index: number): void;
	onAdd(): void;
};

const ToolLevelSvg = () => (
	<svg width="1em" height="1em" viewBox="0 0 29 29" fill="currentColor">
		<rect width="29" height="29" />
	</svg>
);
const ToolLevelIcon = (props: any) => <Icon component={ToolLevelSvg} {...props} />;

const UserToolBlock = ({ visible, tools, onDelete, onAdd }: UserToolBlockParams) => {
	const BraftEditor = dynamic(() => import('braft-editor'), { ssr: false });
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
	const userToolDesc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

	const toolSection = (school: any, idx: number) => (
		<div className={styles.schoolSection} key={idx}>
			<div className={styles.schoolSectionExtra}>
				<Tooltip title="Delete job data">
					<Button
						shape="circle"
						type="text"
						icon={<DeleteOutlined />}
						className={styles.schoolSectionExtraBtn}
						onClick={() => onDelete(idx)}
					/>
				</Tooltip>
			</div>

			<Row>
				<Col span={14}>
					<Form.Item
						name={['tool', idx, 'title']}
						label="Title"
						rules={[{ required: true, message: 'Please input the field!' }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={8} offset={2}>
					<Form.Item
						name={['tool', idx, 'level']}
						label="Level"
						rules={[{ required: true, message: 'Please input the field!' }]}
					>
						<Rate allowClear={false} tooltips={userToolDesc} character={<ToolLevelIcon />} />
					</Form.Item>
				</Col>
			</Row>

			<Form.Item name={['tool', idx, 'description']} label="Description" style={{ marginBottom: 0 }}>
				<BraftEditor
					className={styles.textEditor}
					controls={controls}
					language="en"
					contentClassName={styles.textEditorContent}
				/>
			</Form.Item>
		</div>
	);

	return (
		<div className={styles.section}>
			<h4>Tools, services, software</h4>
			<p>What tools do you use when using this skill?</p>
			{tools?.map(toolSection)}
			<Button size="small" type="text" onClick={onAdd}>
				<PlusOutlined /> Add tool
			</Button>
		</div>
	);
};

export default UserToolBlock;
