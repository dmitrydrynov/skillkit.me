/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Divider, Form, Input, Row, Space, Tooltip } from 'antd';
import { ControlType } from 'braft-editor';
import dynamic from 'next/dynamic';
import styles from './UserSchoolBlock.module.less';

type UserSchoolBlockParams = {
	visible?: boolean;
	schools?: any[];
	onDelete(index: number): void;
	onAdd(): void;
};

const UserSchoolBlock = ({ visible, schools, onDelete, onAdd }: UserSchoolBlockParams) => {
	const BraftEditor = dynamic(() => import('braft-editor'), { ssr: false });
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];

	const schoolSection = (school: any, idx: number) => (
		<div className={styles.schoolSection} key={idx}>
			<div className={styles.schoolSectionExtra}>
				<Tooltip title="Delete education data">
					<Button
						shape="circle"
						type="text"
						icon={<DeleteOutlined />}
						className={styles.schoolSectionExtraBtn}
						onClick={() => onDelete(idx)}
					/>
				</Tooltip>
			</div>
			<Form.Item name={['school', idx, 'title']} label="School" rules={[{ required: true, message: 'Please input the field!' }]}>
				<Input />
			</Form.Item>

			<Row>
				<Col span={5}>
					<Form.Item
						name={['school', idx, 'startedAt']}
						label="Start date"
						rules={[{ required: true, message: 'Please input the field!' }]}>
						<DatePicker placeholder="Start date" picker="month" format="MMM YYYY" />
					</Form.Item>
				</Col>
				<Col span={5} offset={1}>
					<Form.Item
						name={['school', idx, 'finishedAt']}
						label="Finish date"
						rules={[{ required: true, message: 'Please input the field!' }]}>
						<DatePicker placeholder="Finish date" picker="month" format="MMM YYYY" />
					</Form.Item>
				</Col>
			</Row>
			<Form.Item name={['school', idx, 'description']} label="Description" style={{ marginBottom: 0 }}>
				<BraftEditor className={styles.textEditor} controls={controls} language="en" contentClassName={styles.textEditorContent} />
			</Form.Item>
		</div>
	);

	return (
		<div className={styles.section}>
			<h4>Education</h4>
			<p>Where did you learn this skill?</p>
			{schools?.map(schoolSection)}
			<Button size="small" type="text" onClick={onAdd}>
				<PlusOutlined /> Add school
			</Button>
		</div>
	);
};

export default UserSchoolBlock;
