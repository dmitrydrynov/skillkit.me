import { ReactElement } from 'react';
import AdminMenu from '@components/menus/AdminMenu';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { UserRole } from 'src/definitions/user';

const AdminPostsPage = () => {
	return <p>Text</p>;
};

AdminPostsPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout title="Posts" siderMenu={<AdminMenu selectedItem="/admin/posts" />} can={{ roles: [UserRole.ADMIN] }}>
		{page}
	</ProtectedLayout>
);

export default AdminPostsPage;
