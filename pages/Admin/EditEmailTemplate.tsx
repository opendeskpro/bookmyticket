import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { MOCK_USERS, MOCK_EMAIL_TEMPLATES } from '../../constants/mockData';
import Button from '../../components/Shared/UI/Button';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EditEmailTemplate: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const admin = MOCK_USERS[2]; // Assuming admin user

    const [template, setTemplate] = useState<any>(null);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const foundTemplate = MOCK_EMAIL_TEMPLATES.find(t => t.id === Number(id));
        if (foundTemplate) {
            setTemplate(foundTemplate);
            setSubject(foundTemplate.subject);
            // Set default content based on type
            let defaultContent = '';
            switch (foundTemplate.type) {
                case 'Verify Email':
                    defaultContent = `
                        <p>Hi {username},</p>
                        <p>We just need to verify your email address before you can access to your dashboard.</p>
                        <p>Verify your email address, {verification_link}.</p>
                        <p>Thank you.</p>
                        <p>{website_title}</p>
                    `;
                    break;
                case 'Product Order':
                    setSubject('Order Confirmation');
                    defaultContent = `
                        <p>Hi {customer_name},</p>
                        <p>Your Order has been successfully Placed.</p>
                        <p>Order Id: #{order_id}</p>
                        <p>Also, we have attached an invoice in this mail.</p>
                        <p>Best regards.</p>
                        <p>{website_title}</p>
                    `;
                    break;
                case 'Reset Password':
                    setSubject('Recover Password of Your Account');
                    defaultContent = `
                        <p>Hi {username},</p>
                        <p>We have received a request to reset your password. If you did not make the request, just ignore this email. Otherwise, you can reset your password using this below link.</p>
                        <p>{password_reset_link}</p>
                        <p>Thanks,</p>
                        <p>{website_title}</p>
                    `;
                    break;
                default:
                    defaultContent = `<p>Default content for ${foundTemplate.type}</p>`;
            }
            setContent(defaultContent);
        } else {
            toast.error('Template not found');
            navigate('/admin/email-templates');
        }
    }, [id, navigate]);

    const handleSave = () => {
        toast.success('Email Template Updated Successfully!');
        // In a real app, this would make an API call
    };

    const getBBCodes = (type: string) => {
        const commonCodes = [
            { code: '{username}', meaning: 'Username of User' },
            { code: '{website_title}', meaning: 'Website Title' },
        ];

        switch (type) {
            case 'Verify Email':
                return [
                    ...commonCodes,
                    { code: '{verification_link}', meaning: 'Email Verification Link' }
                ];
            case 'Product Order':
                return [
                    { code: '{customer_name}', meaning: 'Name of The Customer' },
                    { code: '{order_id}', meaning: 'Product Order Id' },
                    { code: '{website_title}', meaning: 'Website Title' }
                ];
            case 'Reset Password':
                return [
                    ...commonCodes,
                    { code: '{password_reset_link}', meaning: 'Password Reset Link' }
                ];
            default:
                return commonCodes;
        }
    };

    if (!template) return <div>Loading...</div>;

    return (
        <DashboardLayout user={admin}>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Edit Mail Template</h1>
                    <Button variant="secondary" onClick={() => navigate('/admin/email-templates')}>
                        < ArrowLeft size={18} className="mr-2" /> Back
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Editor */}
                    <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mail Type</label>
                            <input
                                type="text"
                                value={template.type}
                                readOnly
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mail Subject*</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mail Body*</label>
                            <div className="h-[400px] mb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    className="h-[350px]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-start pt-4">
                            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto px-8">
                                <Save size={18} className="mr-2" /> Update
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: BB Codes */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
                        <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">BB Code Meaning</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-medium">
                                    <tr>
                                        <th className="p-3">BB Code</th>
                                        <th className="p-3">Meaning</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {getBBCodes(template.type).map((item, index) => (
                                        <tr key={index}>
                                            <td className="p-3 font-mono text-blue-600">{item.code}</td>
                                            <td className="p-3 text-gray-600">{item.meaning}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EditEmailTemplate;
