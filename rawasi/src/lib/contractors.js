// contractors.js
import contractorsData from '../data/modern_building_contractors.json';

export const fetchContractors = (techType) => {
  const filteredContractors = contractorsData.filter(contractor =>
    contractor.Building_Tech_Type.toLowerCase() === techType.toLowerCase()
  );
  return filteredContractors;
};
