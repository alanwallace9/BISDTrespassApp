
import React from 'react';
import { TrespassedIndividual, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface TrespassCardProps {
  individual: TrespassedIndividual;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusColors = {
    'Active': 'bg-red-500 text-red-100',
    'Warning': 'bg-yellow-500 text-yellow-100',
    'Expired': 'bg-gray-500 text-gray-100',
};

const TrespassCard: React.FC<TrespassCardProps> = ({ individual, onViewDetails, onEdit, onDelete }) => {
    const { user } = useAuth();

    const canModify = () => {
        if (!user) return false;
        if (user.role === UserRole.MASTER_ADMIN || user.role === UserRole.DISTRICT_ADMIN) {
            return true;
        }
        if (user.role === UserRole.CAMPUS_ADMIN && user.campus === individual.trespassedFrom) {
            return true;
        }
        return false;
    }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/20 flex flex-col">
      <div className="relative">
        <img src={individual.imageUrl} alt={`${individual.firstName} ${individual.lastName}`} className="w-full h-48 object-cover" />
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${statusColors[individual.status]}`}>
            {individual.status}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white">{individual.firstName} {individual.lastName}</h3>
        <p className="text-sm text-blue-300 mb-2">{individual.trespassedFrom}</p>
        <p className="text-xs text-gray-400">Warning Expires: {individual.warningExpiresDate}</p>
        <div className="mt-auto pt-4 flex gap-2">
            <button onClick={onViewDetails} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800">
                Details
            </button>
            {canModify() && (
                <>
                <button onClick={onEdit} className="p-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                </button>
                <button onClick={onDelete} className="p-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default TrespassCard;