import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { MOCK_USERS, MOCK_EMAIL_TEMPLATES } from '../../constants/mockData';
import Button from '../../components/Shared/UI/Button';
import { Edit, Search } from 'lucide-react';

const EmailTemplates: React.FC = () => {
    const admin = MOCK_USERS[2];
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTemplates = MOCK_EMAIL_TEMPLATES.filter(template =>
        template.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout user={admin}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Mail Templates</h1>
                    <p className="text-gray-500">Manage automated email notifications sent to users.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600 w-16">#</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Mail Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Mail Subject</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTemplates.map((template) => (
                                <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{template.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{template.type}</td>
                                    <td className="px-6 py-4 text-gray-600">{template.subject}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="bg-[#6366f1] text-white hover:bg-[#5558e6] border-none"
                                            onClick={() => window.location.hash = `/admin/email-templates/edit/${template.id}`}
                                        >
                                            <Edit size={14} className="mr-1" /> Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTemplates.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No templates found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmailTemplates;
