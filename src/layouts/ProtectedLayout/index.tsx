import { FC } from 'react';
import UserMenu from '@components/UserMenu';
// import { RootState } from '@store/configure-store';
import { Col, Layout, Row } from 'antd';
// import { useRouter } from 'next/router';
// import { useSelector } from 'react-redux';
import styles from './ProtectedLayout.module.less';

const { Header, Content, Sider } = Layout;

type ProtectedLayoutParams = {
    title: string;
}

const ProtectedLayout: FC<ProtectedLayoutParams> = ({ children, title }) => {
    // const { loggedIn } = useSelector((state: RootState) => state.auth);
    // const router = useRouter();

    // useEffect(() => {
    //     if (!loggedIn) {
    //         router.push('/');
    //     }
    // })

    return (
        <Layout style={{ minHeight: '100vh', maxWidth: '1440px', margin: '0 auto' }}>
            <Sider className={styles.sider}>
                <div className={styles.logo} />
            </Sider>
            <Layout className="site-layout">
                <Header className={styles.header} >
                    <Row justify="space-between" align="middle" style={{ height: 'inherit' }} >
                        {!!title &&
                            <Col>
                                <h2>{title}</h2>
                            </Col>
                        }
                        <Col>
                            <UserMenu />
                        </Col>
                    </Row>
                </Header>
                <Content style={{ margin: '40px' }}>{children}</Content>
            </Layout>
        </Layout >
    )
}

export default ProtectedLayout;