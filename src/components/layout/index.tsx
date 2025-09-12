import BottomNavigation from '../BottomNavigation'
import { useAppSelector } from '../../store/hooks'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    return (
        <div className="flex flex-col h-screen w-full sm:max-w-md mx-auto bg-gray-50">
            <main className="flex-1 overflow-y-auto pb-20">
                {children}
            </main>

            {isAuthenticated && <BottomNavigation />}
        </div>
    );
};

export default Layout;