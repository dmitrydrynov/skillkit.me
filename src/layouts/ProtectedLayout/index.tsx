import { Col, Layout, Row } from "antd";
import React, { FC } from "react";
import styles from './ProtectedLayout.module.less';
import UserMenu from "@components/UserMenu";
import { useSelector } from "react-redux";
import { RootState } from "src/store/configure-store";
import NoFoundPage from "@pages/404";

const { Header, Content, Sider } = Layout;

type ProtectedLayoutParams = {
    title?: string;
}

const ProtectedLayout: FC<ProtectedLayoutParams> = ({ children, title }) => {
    const { loggedIn } = useSelector((state: RootState) => state.auth);

    if(!loggedIn) {
        return <NoFoundPage />;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider className={styles.sider}>
                <div className={styles.logo}></div>
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
                <Content style={{ margin: '64px 40px 40px', paddingTop: '40px' }}>{children}</Content>
            </Layout>
        </Layout >
    )
}

export default ProtectedLayout;