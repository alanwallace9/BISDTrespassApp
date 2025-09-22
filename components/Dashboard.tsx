import React, { useState, useMemo } from 'react';
import { MOCK_TRESPASS_DATA, MOCK_USERS } from '../constants';
import { TrespassedIndividual, User, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import TrespassCard from './TrespassCard';
import TrespassDetailModal from './TrespassDetailModal';
import AddEditTrespassModal from './AddEditTrespassModal';
import SettingsPage from './SettingsPage';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [trespassList, setTrespassList] = useState<TrespassedIndividual[]>(MOCK_TRESPASS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndividual, setSelectedIndividual] = useState<TrespassedIndividual | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIndividual, setEditingIndividual] = useState<TrespassedIndividual | null>(null);

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');

  const canEdit = user?.role === UserRole.MASTER_ADMIN || user?.role === UserRole.DISTRICT_ADMIN || user?.role === UserRole.CAMPUS_ADMIN;
  const canManageUsers = user?.role === UserRole.MASTER_ADMIN || user?.role === UserRole.DISTRICT_ADMIN;

  const filteredList = useMemo(() => {
    return trespassList.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.trespassedFrom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trespassList, searchTerm]);

  const handleViewDetails = (individual: TrespassedIndividual) => {
    setSelectedIndividual(individual);
    setIsDetailModalOpen(true);
  };
  
  const handleOpenAddModal = () => {
    setEditingIndividual(null);
    setIsEditModalOpen(true);
  };
  
  const handleOpenEditModal = (individual: TrespassedIndividual) => {
    setEditingIndividual(individual);
    setIsEditModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        setTrespassList(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = (individual: TrespassedIndividual) => {
      if (editingIndividual) { // Editing
          setTrespassList(prev => prev.map(p => p.id === individual.id ? individual : p));
      } else { // Adding
          const newIndividual = { ...individual, id: new Date().toISOString() };
          setTrespassList(prev => [newIndividual, ...prev]);
      }
      setIsEditModalOpen(false);
      setEditingIndividual(null);
  };
  
  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    // In a real app, this would be an API call to Supabase to invite a user.
    // For now, we'll manage it in local state.
    const userToAdd: User = { ...newUser, id: new Date().toISOString() };
    setUsers(prev => [...prev, userToAdd]);
    alert(`User invitation for ${newUser.username} sent successfully!`); // Simple feedback
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
        setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  if (!user) {
    return null; // Should not happen if AuthProvider is working, but good practice
  }


  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {view === 'dashboard' ? (
        <main className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <input
                type="text"
                placeholder="Search by name or campus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {canEdit && (
                <button onClick={handleOpenAddModal} className="w-full md:w-auto px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Add New Record
                </button>
            )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredList.map(p => (
                    <TrespassCard 
                        key={p.id} 
                        individual={p} 
                        onViewDetails={() => handleViewDetails(p)}
                        onEdit={() => handleOpenEditModal(p)}
                        onDelete={() => handleDelete(p.id)}
                    />
                ))}
            </div>
            {filteredList.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">No records found.</p>
                    <p>Try adjusting your search term.</p>
                </div>
            )}
        </main>
      ) : (
         <SettingsPage
            currentUser={user}
            users={users}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onBack={() => setView('dashboard')}
         />
      )}

      {canManageUsers && view === 'dashboard' && (
        <button
          onClick={() => setView('settings')}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-transform duration-200 hover:scale-110"
          aria-label="Open Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}

      {isDetailModalOpen && selectedIndividual && (
        <TrespassDetailModal 
            individual={selectedIndividual} 
            onClose={() => setIsDetailModalOpen(false)} 
        />
      )}

      {isEditModalOpen && user && (
        <AddEditTrespassModal
            individual={editingIndividual}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSave}
            user={user}
        />
      )}
    </div>
  );
};

export default Dashboard;