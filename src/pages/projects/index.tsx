import React, { ReactElement, useState } from 'react';
import AddProjectModal from '@components/modals/AddProjectModal';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { getProjectsQuery } from '@services/graphql/queries/project';
import { RootState } from '@store/configure-store';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, PageHeader, Card, Avatar } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useQuery } from 'urql';
import styles from './style.module.less';

const ProjectsPage: NextPageWithLayout = () => {
	const [form] = Form.useForm();
	const [visibleAddProjectModal, setVisibleAddProjectModal] = useState<boolean>(false);
	const userId = useSelector((state: RootState) => state.user.id);
	const [projects] = useQuery({
		query: getProjectsQuery,
	});

	const handleFinish = async () => {
		//
	};

	return (
		<>
			<Head>
				<title>Projects</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<AddProjectModal
				operation={'create'}
				recordId={'asdadad'}
				visible={visibleAddProjectModal}
				onClose={() => setVisibleAddProjectModal(false)}
				onFinish={handleFinish}
			/>
			<PageHeader
				className={styles.pageHeader}
				title="Projects"
				backIcon={false}
				extra={[
					<Button
						type="primary"
						key="add-project-button"
						icon={<PlusOutlined />}
						onClick={() => setVisibleAddProjectModal(true)}
					>
						Add project
					</Button>,
				]}
			/>
			<Row gutter={16}>
				{projects.data?.projects.map((project, idx) => (
					<Col key={project.id} xs={24} sm={24} md={12} lg={8} xl={6}>
						<Card
							hoverable
							style={{ width: '100%', marginTop: 16 }}
							// eslint-disable-next-line @next/next/no-img-element
							cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
							// eslint-disable-next-line react/jsx-key
							actions={[<EditOutlined key="edit" />, <Link href={`/projects/${project.id}`}>Enter</Link>]}
						>
							<Card.Meta
								avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
								title={project.title}
								description={project.genre}
							/>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
};

ProjectsPage.getLayout = (page: ReactElement) => <ProtectedLayout title="Projects">{page}</ProtectedLayout>;

export default ProjectsPage;
