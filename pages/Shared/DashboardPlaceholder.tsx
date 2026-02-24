import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { Construction } from 'lucide-react';
import { User } from '../../types';

interface DashboardPlaceholderProps {
    title: string;
    user: User | null;
}

const DashboardPlaceholder: React.FC<DashboardPlaceholderProps> = ({ title, user }) => {
    return (
        <DashboardLayout user={user}>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                    <Construction size={48} className="text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <p className="text-gray-500 max-w-md">
                    This feature is currently under development. Check back soon for updates!
                </p>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPlaceholder;
