import React from 'react'
import { Menu } from 'antd'
import Link from 'next/link'

type SettingsMenuParams = {
    selectedItem: string;
}

export const SettingsMenu = ({ selectedItem }: SettingsMenuParams) => {
    const handleProfileMenu = () => { }

    return (
        <Menu
            onSelect={handleProfileMenu}
            mode="inline"
            defaultSelectedKeys={[selectedItem]}
        >
            <Menu.Item key="profile">
                <Link href="/settings/profile"><a>Profile</a></Link>
            </Menu.Item>
            <Menu.Item key="security">
                <Link href="/settings/security"><a>Security</a></Link>
            </Menu.Item>
        </Menu>
    )
}