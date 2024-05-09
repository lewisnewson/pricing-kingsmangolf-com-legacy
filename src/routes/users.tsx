import { useState } from "react"
import { DesktopOutlined, PieChartOutlined, UserOutlined } from "@ant-design/icons"
import { Breadcrumb, Layout, Menu } from "antd"

import Logo from "../assets/images/kingsman_logo.webp"

const { Header, Content, Sider } = Layout

const items: any[] = [
    { key: "sub1", label: "Option 1", icon: <PieChartOutlined /> },
    { key: "sub2", label: "Option 2", icon: <DesktopOutlined /> },
    { key: "sub3", label: "Option 3", icon: <UserOutlined /> },
]

export default function Users() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <img src={Logo} />

                <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: "#ffffff" }} />
                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                </Content>
            </Layout>
        </Layout>
    )
}
