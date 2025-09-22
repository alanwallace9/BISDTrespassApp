
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { CAMPUSES } from '../constants';

interface SettingsPageProps {
    currentUser: User;
    users: User[];
    onAddUser: (newUser: Omit<User, 'id'>) => void;
    onDeleteUser: (userId: string) => void;
    onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, users, onAddUser, onDeleteUser, onBack }) => {
    const availableRoles = currentUser.role === UserRole.MASTER_ADMIN 
        ? [UserRole.DISTRICT_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.VIEWER] 
        : [UserRole.CAMPUS_ADMIN, UserRole.VIEWER];

    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>(availableRoles[availableRoles.length - 1]);
    const [campus, setCampus] = useState<string>('');
    const [error, setError] = useState('');

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (role === UserRole.CAMPUS_ADMIN && !campus) {
            setError('Please select a campus for the Campus Admin.');
            return;
        }
        
        onAddUser({
            username: email,
            role,
            campus: role === UserRole.CAMPUS_ADMIN ? campus : undefined,
        });

        // Reset form
        setEmail('');
        setRole(availableRoles[availableRoles.length - 1]);
        setCampus('');
    };
    
    const roleToId = (role: UserRole) => role.replace(/\s+/g, '-').toLowerCase();

    return (
        <main className="container mx-auto p-4 md:p-6">
            <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Back to Dashboard
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create User Form */}
                <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Create New User</h2>
                    <p className="text-gray-400 text-sm mb-6">Enter the user's email to send an invitation. They will be prompted to set their own password.</p>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Role</label>
                            <div className="mt-2 space-y-2">
                                {availableRoles.map(r => (
                                    <div key={r} className="flex items-center">
                                        <input id={roleToId(r)} name="role" type="radio" checked={role === r} onChange={() => setRole(r)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 bg-gray-800" />
                                        <label htmlFor={roleToId(r)} className="ml-3 block text-sm font-medium text-gray-300">{r === UserRole.VIEWER ? 'user' : r}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {role === UserRole.CAMPUS_ADMIN && (
                            <div>
                                <label htmlFor="campus" className="block text-sm font-medium text-gray-300">Campus</label>
                                <select id="campus" value={campus} onChange={e => setCampus(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500">
                                    <option value="">Select a campus</option>
                                    {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900">Send Invitation</button>
                    </form>
                </div>

                {/* Manage Users List */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Manage Users</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Campus</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role === UserRole.VIEWER ? 'user' : user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.campus || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {currentUser.role === UserRole.MASTER_ADMIN && currentUser.id !== user.id && (
                                                <button onClick={() => onDeleteUser(user.id)} className="text-red-500 hover:text-red-400">Delete</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SettingsPage;