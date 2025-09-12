import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { User, Mail, Calendar, Settings, Edit3 } from "lucide-react";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white">
                <div className="flex items-center gap-2">
                    <User size={20} className="text-gray-600" />
                    <span className="text-gray-700 font-medium">Profile</span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* Profile Header */}
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full mb-4 flex items-center justify-center mx-auto">
                        <span className="text-3xl font-bold text-blue-600">
                            {user?.name?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || 'User Profile'}</h1>
                    <p className="text-gray-600">{user?.email}</p>
                </div>

                {/* User Details */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User size={20} className="text-gray-500" />
                            <div className="flex-1">
                                <div className="text-sm text-gray-600">Full Name</div>
                                <div className="font-medium text-gray-900">{user?.name || 'Not provided'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={20} className="text-gray-500" />
                            <div className="flex-1">
                                <div className="text-sm text-gray-600">Email Address</div>
                                <div className="font-medium text-gray-900">{user?.email || 'Not provided'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-gray-500" />
                            <div className="flex-1">
                                <div className="text-sm text-gray-600">Member Since</div>
                                <div className="font-medium text-gray-900">Today</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                    <div className="space-y-3">
                        <Button 
                            variant="outline" 
                            className="w-full h-12 flex items-center justify-center gap-3"
                        >
                            <Edit3 size={20} className="text-gray-600" />
                            <span>Edit Profile</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full h-12 flex items-center justify-center gap-3"
                        >
                            <Settings size={20} className="text-gray-600" />
                            <span>Account Settings</span>
                        </Button>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="pt-4 pb-20">
                    <Button 
                        variant="outline" 
                        className="w-full h-12" 
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
