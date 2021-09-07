import { FC } from 'react'
import { Header } from './Header'
import SignInModal from '@components/modals/SignIn'
import styles from './style.module.scss'

export const PublicLayout: FC = ({ children }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Header />
            <div className={styles.content}>
                {children}
            </div>
            <SignInModal />
        </div>
    )
}

export default PublicLayout
