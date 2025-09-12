import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { User, Mail, Calendar } from "lucide-react";

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white">
                <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-gray-600" />
                    <span className="text-gray-700 font-medium">Today, {today}</span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* Welcome Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={32} className="text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1>
                        <p className="text-gray-600">You're successfully logged in to BiteCount</p>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <User size={20} className="text-gray-500" />
                            <div>
                                <div className="text-sm text-gray-600">Name</div>
                                <div className="font-medium text-gray-900">{user?.name || 'Not provided'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={20} className="text-gray-500" />
                            <div>
                                <div className="text-sm text-gray-600">Email</div>
                                <div className="font-medium text-gray-900">{user?.email || 'Not provided'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-gray-500" />
                            <div>
                                <div className="text-sm text-gray-600">Member Since</div>
                                <div className="font-medium text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    month: 'short', 
                                    day: 'numeric' 
                                }) : 'Not provided'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="h-16 flex flex-col items-center justify-center"
                            onClick={() => navigate('/profile')}
                        >
                            <User size={20} className="text-gray-600 mb-1" />
                            <span className="text-sm text-gray-600">Edit Profile</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="h-16 flex flex-col items-center justify-center"
                            onClick={() => navigate('/profile')}
                        >
                            <Mail size={20} className="text-gray-600 mb-1" />
                            <span className="text-sm text-gray-600">Settings</span>
                        </Button>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="pt-4 pb-20">
                    <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
