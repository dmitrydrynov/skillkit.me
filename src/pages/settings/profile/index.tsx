import { ReactElement, useEffect, useMemo, useState } from 'react';
import SettingsMenu from '@components/menus/SettingsMenu';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { updateUserMutation, userDataQuery } from '@services/graphql/queries/user';
import { RootState } from '@store/configure-store';
import { setUserData } from '@store/reducers/user';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Col, DatePicker, Form, Input, Row, Spin, Upload, message } from 'antd';
import moment from 'moment';
import Head from 'next/head';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import countryList from 'react-select-country-list';
import { useMutation, useQuery } from 'urql';
import styles from './ProfilePage.module.less';

const IMAGES_HOST = process.env.NEXT_PUBLIC_IMAGES_HOST;

// eslint-disable-next-line no-unused-vars
function getBase64(img: Blob, callback: (args: any) => void) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

const ProfilePage: NextPageWithLayout = () => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const countries = useMemo(() => countryList().getData(), []);
	const userId = useSelector((state: RootState) => state.user.id);
	const [, updateUserData] = useMutation(updateUserMutation);
	const [{ data, fetching }] = useQuery({
		query: userDataQuery,
		variables: { id: userId },
	});
	const [avatarLoading, setAvatarLoading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState(null);

	useEffect(() => {
		if (data?.user) {
			const { firstName, lastName, email, country, birthdayDate, avatar } = data.user;

			if (avatar) {
				setAvatarUrl(avatar.src);
			}

			form.setFieldsValue({
				firstName,
				lastName,
				email,
				country: country || undefined,
				birthdayDate: moment(birthdayDate) || null,
			});
		}
	}, [data, form]);

	const countryFlag = (countryCode: string) => <span className={`flag-icon flag-icon-${countryCode.toLowerCase()}`} />;

	const handleFinish = async () => {
		const values = form.getFieldsValue();
		const updateData = {
			...values,
			id: userId,
		};

		if (values.avatar) {
			updateData.avatar = {
				upload: values.avatar.file.originFileObj,
			};
		}

		try {
			const { error } = await updateUserData(updateData);

			if (error) {
				message.error(error.message);
				return;
			}

			message.success('Profile saved!');

			dispatch(setUserData(updateData));
		} catch (error: any) {
			message.error(error.message);
		}
	};

	const uploadButton = (
		<div>
			{avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	const handleAvatarChange = (info: any) => {
		console.log('handleAvatarChange', info);

		if (info.file.status === 'uploading') {
			setAvatarLoading(true);

			getBase64(info.file.originFileObj, (imageUrl) => {
				setAvatarUrl(imageUrl);
				setAvatarLoading(false);
			});

			return;
		}

		if (info.file.status === 'done') {
			getBase64(info.file.originFileObj, () => {
				setAvatarLoading(false);
			});
		}
	};

	return (
		<>
			<Head>
				<title>Profile</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<SettingsMenu selectedItem="profile" />
			<Row>
				<Col flex="1" className={styles.content}>
					<h3>Profile settings</h3>
					<Spin spinning={fetching}>
						<Form className={styles.form} form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
							<Form.Item name="avatar" label="Photo">
								<Upload
									listType="picture-card"
									className="avatar-uploader"
									showUploadList={false}
									// customRequest={uploadAvatar}
									// action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
									// beforeUpload={beforeUpload}
									onChange={handleAvatarChange}
								>
									{avatarUrl ? (
										<Image
											loader={({ src }) => IMAGES_HOST + src}
											src={avatarUrl}
											alt="avatar"
											className={styles.avatar}
											width="200px"
											height="200px"
										/>
									) : (
										uploadButton
									)}
								</Upload>
							</Form.Item>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										name="firstName"
										label="First name"
										rules={[
											{
												required: true,
												message: 'Please input the first name!',
											},
										]}
									>
										<Input placeholder="First name" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name="lastName"
										label="Last name"
										rules={[
											{
												required: true,
												message: 'Please input the last name!',
											},
										]}
									>
										<Input placeholder="Last name" />
									</Form.Item>
								</Col>
							</Row>

							<Form.Item
								name="email"
								label="Email"
								rules={[{ type: 'email', required: true, message: 'Please input the email!' }]}
							>
								<Input placeholder="Email" />
							</Form.Item>

							<Form.Item
								name="country"
								label="Country"
								rules={[{ required: true, message: 'Please input the email!' }]}
							>
								<AutoComplete
									allowClear
									placeholder="Country"
									filterOption={(inputValue, option) =>
										option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
									}
									suffixIcon={<span className="flag-icon flag-icon-by" />}
								>
									{countries.map(({ value, label }: any) => (
										<AutoComplete.Option key={value} value={label}>
											{countryFlag(value)} {label}
										</AutoComplete.Option>
									))}
								</AutoComplete>
							</Form.Item>

							<Form.Item
								name="birthdayDate"
								label="Date of birth"
								rules={[{ required: true, message: 'Please input the email!' }]}
							>
								<DatePicker
									placeholder="Birthday date"
									defaultPickerValue={moment().subtract(10, 'years').startOf('day')}
									format="DD.MM.YYYY"
								/>
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit" style={{ marginTop: '15px' }}>
									Save settings
								</Button>
							</Form.Item>
						</Form>
					</Spin>
				</Col>
			</Row>
		</>
	);
};

ProfilePage.getLayout = (page: ReactElement) => <ProtectedLayout title="Profile">{page}</ProtectedLayout>;

export default ProfilePage;
