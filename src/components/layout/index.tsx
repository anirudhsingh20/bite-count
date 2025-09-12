const Layout = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex flex-col h-screen overflow-y-auto w-full sm:max-w-md mx-auto">
        {children}
    </div>;
};

export default Layout;