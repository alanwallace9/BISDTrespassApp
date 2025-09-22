
import React, { useState, useEffect } from 'react';
import { TrespassedIndividual, User, UserRole } from '../types';
import { CAMPUSES } from '../constants';

interface AddEditTrespassModalProps {
    individual: TrespassedIndividual | null;
    onClose: () => void;
    onSave: (data: TrespassedIndividual) => void;
    user: User;
}

const InputField: React.FC<{id: string, name?:string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, type?: string}> = 
    ({ id, name, label, value, onChange, required = true, type = 'text' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>
        <input type={type} id={id} name={name || id} value={value} onChange={onChange} required={required} className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
    </div>
);


const AddEditTrespassModal: React.FC<AddEditTrespassModalProps> = ({ individual, onClose, onSave, user }) => {
    const [formData, setFormData] = useState<Omit<TrespassedIndividual, 'id'>>({
        firstName: '',
        lastName: '',
        dob: '',
        status: 'Warning',
        association: '',
        guardianName: '',
        guardianPhone: '',
        warningExpiresDate: '',
        trespassedFrom: '',
        contactInfo: '',
        currentSchool: '',
        imageUrl: `https://picsum.photos/seed/${new Date().getTime()}/400/400`,
        notes: '',
    });

    useEffect(() => {
        if (individual) {
            setFormData(individual);
        } else {
            // Pre-fill campus for campus admins
            if(user.role === UserRole.CAMPUS_ADMIN && user.campus){
                setFormData(prev => ({...prev, trespassedFrom: user.campus || ''}));
            }
        }
    }, [individual, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            id: individual ? individual.id : new Date().toISOString()
        }
        onSave(dataToSave);
    };
    
    const isCampusAdmin = user.role === UserRole.CAMPUS_ADMIN;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
            <div className="relative bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-xl font-semibold leading-6 text-white">{individual ? 'Edit Record' : 'Add New Record'}</h3>
                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField id="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
                                <InputField id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField id="dob" label="Date of Birth" value={formData.dob} onChange={handleChange} type="date" />
                                 <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                                    <select id="status" name="status" value={formData.status} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option>Warning</option>
                                        <option>Active</option>
                                        <option>Expired</option>
                                    </select>
                                </div>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField id="association" label="Association (e.g., Parent)" value={formData.association} onChange={handleChange} />
                                <InputField id="warningExpiresDate" name="warningExpiresDate" label="Warning Expires" value={formData.warningExpiresDate} onChange={handleChange} type="date" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField id="guardianName" label="Guardian Name" value={formData.guardianName} onChange={handleChange} required={false} />
                                <InputField id="guardianPhone" label="Guardian Phone" value={formData.guardianPhone} onChange={handleChange} required={false} />
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField id="contactInfo" label="Contact Info" value={formData.contactInfo} onChange={handleChange} required={false}/>
                                <InputField id="currentSchool" label="Current School" value={formData.currentSchool} onChange={handleChange} required={false}/>
                             </div>
                            <div>
                                <label htmlFor="trespassedFrom" className="block text-sm font-medium text-gray-300">Trespassed From (Campus)</label>
                                <select id="trespassedFrom" name="trespassedFrom" value={formData.trespassedFrom} onChange={handleChange} disabled={isCampusAdmin} required className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-700 disabled:cursor-not-allowed">
                                    <option value="">Select a campus</option>
                                    {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes</label>
                                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                            </div>
                            <InputField id="imageUrl" label="Image URL" value={formData.imageUrl} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Save
                        </button>
                        <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditTrespassModal;