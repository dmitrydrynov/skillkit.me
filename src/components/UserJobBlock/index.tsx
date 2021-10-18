/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Divider, Form, Input, Row, Space, Tooltip } from 'antd';
import { ControlType } from 'braft-editor';
import dynamic from 'next/dynamic';
import styles from './UserJobBlock.module.less';

type UserJobBlockParams = {
	visible?: boolean;
	jobs?: any[];
	onDelete(index: number): void;
	onAdd(): void;
};

const UserJobBlock = ({ visible, jobs, onDelete, onAdd }: UserJobBlockParams) => {
	const BraftEditor = dynamic(() => import('braft-editor'), { ssr: false });
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];

	const jobSection = (school: any, idx: number) => (
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
				<Col span={11}>
					<Form.Item name={['job', idx, 'company']} label="Company name" rules={[{ required: true, message: 'Please input the field!' }]}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={11} offset={2}>
					<Form.Item name={['job', idx, 'title']} label="Job title" rules={[{ required: true, message: 'Please input the field!' }]}>
						<Input />
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={5}>
					<Form.Item name={['job', idx, 'startedAt']} label="Start date" rules={[{ required: true, message: 'Please input the field!' }]}>
						<DatePicker placeholder="Start date" picker="month" format="MMM YYYY" />
					</Form.Item>
				</Col>
				<Col span={5} offset={1}>
					<Form.Item name={['job', idx, 'finishedAt']} label="Finish date" rules={[{ required: true, message: 'Please input the field!' }]}>
						<DatePicker placeholder="Finish date" picker="month" format="MMM YYYY" />
					</Form.Item>
				</Col>
			</Row>
			<Form.Item name={['job', idx, 'description']} label="Description" style={{ marginBottom: 0 }}>
				<BraftEditor className={styles.textEditor} controls={controls} language="en" contentClassName={styles.textEditorContent} />
			</Form.Item>
		</div>
	);

	return (
		<div className={styles.section}>
			<h4>Experience</h4>
			<p>What job did you apply the skill in?</p>
			{jobs?.map(jobSection)}
			<Button size="small" type="text" onClick={onAdd}>
				<PlusOutlined /> Add job
			</Button>
		</div>
	);
};

export default UserJobBlock;
