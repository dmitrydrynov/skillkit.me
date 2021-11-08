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

type UserSchoolBlockParams = {
	form?: FormInstance;
	schools?: any[];
	onDelete(schoolId: string, index: number): Promise<boolean | undefined>;
	onAdd(): void;
};

const UserSchoolBlock = ({ form, schools, onDelete, onAdd }: UserSchoolBlockParams) => {
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
	const [titles, setTitles] = useState<string[] | undefined>([]);
	const [activeKey, setActiveKey] = useState<number>();

	useEffect(() => {
		if (schools) {
			setTitles(schools?.map((d: UserSchool) => d.title));
		}
	}, []);

	const handleUpdateTitle = (event: ChangeEvent<HTMLInputElement>, idx: number) => {
		let updatedTitles = [...titles];
		updatedTitles[idx] = form?.getFieldValue(['schools', idx, 'title']);

		setTitles(updatedTitles);
	};

	const handleAdd = () => {
		if (schools) {
			setActiveKey(schools.length);
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

	const schoolSection = (school: any, idx: number) => (
		<Collapse.Panel
			header={(titles && titles[idx]) || '(Not specified)'}
			className={styles.schoolSection}
			key={idx}
			extra={deleteButton(school.id, idx)}
		>
			<Form.Item name={['schools', idx, 'id']} hidden={true} />

			<Form.Item
				name={['schools', idx, 'title']}
				label="School"
				rules={[{ required: true, message: 'Please input the field!' }]}
			>
				<Input onChange={(event) => handleUpdateTitle(event, idx)} />
			</Form.Item>

			<Row>
				<Col span={5}>
					<Form.Item
						name={['schools', idx, 'startedAt']}
						label="Start month"
						rules={[{ required: true, message: 'Please input the field!' }]}
					>
						<DatePicker placeholder="Start date" picker="month" format="MMM YYYY" />
					</Form.Item>
				</Col>
				<Col span={5} offset={1}>
					<Form.Item
						name={['schools', idx, 'finishedAt']}
						label="Finish month"
						rules={[{ required: true, message: 'Please input the field!' }]}
					>
						<DatePicker placeholder="Finish date" picker="month" format="MMM YYYY" />
					</Form.Item>
				</Col>
			</Row>
			<Form.Item name={['schools', idx, 'description']} label="Description" style={{ marginBottom: 0 }}>
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
			<h4>Education</h4>
			<p>Where did you learn this skill?</p>
			<Space direction="vertical" style={{ width: '100%' }}>
				{!!schools?.length && (
					<Collapse
						accordion
						expandIconPosition="right"
						activeKey={activeKey}
						onChange={(key: any) => setActiveKey(key)}
					>
						{schools?.map(schoolSection)}
					</Collapse>
				)}

				<Button size="small" type="text" onClick={handleAdd}>
					<PlusOutlined /> Add school
				</Button>
			</Space>
		</div>
	);
};

export default UserSchoolBlock;
