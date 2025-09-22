
import React from 'react';
import { TrespassedIndividual } from '../types';

interface TrespassDetailModalProps {
  individual: TrespassedIndividual;
  onClose: () => void;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const TrespassDetailModal: React.FC<TrespassDetailModalProps> = ({ individual, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div 
        className="relative bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gray-800 px-4 pt-4 sm:px-6 sm:pt-6 flex justify-between items-start">
            <div>
                 <h3 className="text-2xl font-bold leading-6 text-white">{individual.firstName} {individual.lastName}</h3>
                 <p className="text-sm text-blue-300">{individual.association}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex-shrink-0">
                    <img src={individual.imageUrl} alt={`${individual.firstName} ${individual.lastName}`} className="w-full h-auto rounded-lg object-cover" />
                </div>
                <div className="md:w-2/3">
                    <dl className="divide-y divide-gray-700">
                        <InfoRow label="Status" value={individual.status} />
                        <InfoRow label="Date of Birth" value={individual.dob} />
                        <InfoRow label="Trespassed From" value={individual.trespassedFrom} />
                        <InfoRow label="Warning Expires" value={individual.warningExpiresDate} />
                        <InfoRow label="Guardian Name" value={individual.guardianName} />
                        <InfoRow label="Guardian Phone" value={individual.guardianPhone} />
                        <InfoRow label="Contact Info" value={individual.contactInfo} />
                        <InfoRow label="Current School" value={individual.currentSchool} />
                    </dl>
                </div>
            </div>
             <div className="mt-4 border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-400">Notes</h4>
                <p className="mt-1 text-sm text-white whitespace-pre-wrap">{individual.notes}</p>
            </div>
        </div>
        <div className="sticky bottom-0 bg-gray-800 px-4 py-3 sm:px-6 flex justify-end">
            <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 bg-gray-700 text-base font-medium text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800"
                onClick={onClose}
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default TrespassDetailModal;