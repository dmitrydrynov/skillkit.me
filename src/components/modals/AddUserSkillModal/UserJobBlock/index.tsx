/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, DatePicker, Form, FormInstance, Input, Popconfirm, Row, Space } from 'antd';
import { ControlType } from 'braft-editor';
import dynamic from 'next/dynamic';
import styles from './style.module.less';

const BraftEditor: any = dynamic(() => import('braft-editor').then((mod: any) => mod.default), {
	ssr: false,
});

type UserJobBlockParams = {
	form?: FormInstance;
	jobs?: any[];
	onDelete(jobId: string, index: number): Promise<boolean | undefined>;
	onAdd(): void;
};

const UserJobBlock = ({ form, jobs, onDelete, onAdd }: UserJobBlockParams) => {
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
	const [titles, setTitles] = useState<string[] | undefined>([]);
	const [activeKey, setActiveKey] = useState<number>();

	useEffect(() => {
		if (jobs) {
			setTitles(jobs?.map((d: UserJob) => d.title));
		}
	}, []);

	const handleUpdateTitle = (event: ChangeEvent<HTMLInputElement>, idx: number) => {
		let updatedTitles = [...titles];
		const jobName = form?.getFieldValue(['jobs', idx, 'title']);
		const companyName = form?.getFieldValue(['jobs', idx, 'company']);

		updatedTitles[idx] = `${jobName} at ${companyName}`;

		setTitles(updatedTitles);
	};

	const handleAdd = () => {
		if (jobs) {
			setActiveKey(jobs.length);
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
			title="Are you sure to delete this job?"
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

	const jobSection = (job: any, idx: number) => (
		<Collapse.Panel
			header={(titles && titles[idx]) || '(Not specified)'}
			className={styles.jobSection}
			key={idx}
			extra={deleteButton(job.id, idx)}
		>
			<Form.Item name={['jobs', idx, 'id']} hidden={true} />

			<Row>
				<Col span={11}>
					<Form.Item
						name={['jobs', idx, 'company']}
						label="Company name"
						rules={[{ required: true, message: 'Please input the field!' }]}
					>
						<Input onChange={(event) => handleUpdateTitle(event, idx)} />
					</Form.Item>
				</Col>
				<Col span={11} offset={2}>
					<Form.Item
						name={['jobs', idx, 'title']}
						label="Job title"
						rules={[{ required: true, message: 'Please input the field!' }]}
					>
						<Input onChange={(event) => handleUpdateTitle(event, idx)} />
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={5}>
					<Form.Item
						name={['jobs', idx, 'startedAt']}
						label="Start month"
						rules={[{ required: true, message: 'Please input the field!' }]}
					>
						<DatePicker placeholder="Start date" picker="month" format="MMM YYYY" />
					</Form.Item>
				</Col>
				<Col span={5} offset={1}>
					<Form.Item
						name={['jobs', idx, 'finishedAt']}
						label="Finish month"
						rules={[{ required: true, message: 'Please input the field!' }]}
					>
						<DatePicker placeholder="Finish date" picker="month" format="MMM YYYY" />
					</Form.Item>
				</Col>
			</Row>
			<Form.Item name={['jobs', idx, 'description']} label="Description" style={{ marginBottom: 0 }}>
				<BraftEditor
					className={styles.textEditor}
					controls={controls}
					language="en"
					contentClassName={styles.textEditorContent}
				/>
			</Form.Item>
		</Collapse.Panel>
	);

	return (
		<div className={styles.section}>
			<h4>Experience</h4>
			<p>What job did you apply the skill in?</p>
			<Space direction="vertical" style={{ width: '100%' }}>
				{!!jobs?.length && (
					<Collapse
						accordion
						expandIconPosition="right"
						activeKey={activeKey}
						onChange={(key: any) => setActiveKey(key)}
					>
						{jobs?.map(jobSection)}
					</Collapse>
				)}

				<Button size="small" type="text" onClick={handleAdd}>
					<PlusOutlined /> Add job
				</Button>
			</Space>
		</div>
	);
};

export default UserJobBlock;
