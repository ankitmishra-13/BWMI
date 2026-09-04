export type IndiaRegion = {
  code: string;
  name: string;
  kind: 'State' | 'Union territory';
  capital: string;
};

export const INDIA_REGIONS: IndiaRegion[] = [
  { code: 'AP', name: 'Andhra Pradesh', kind: 'State', capital: 'Amaravati' },
  { code: 'AR', name: 'Arunachal Pradesh', kind: 'State', capital: 'Itanagar' },
  { code: 'AS', name: 'Assam', kind: 'State', capital: 'Dispur' },
  { code: 'BR', name: 'Bihar', kind: 'State', capital: 'Patna' },
  { code: 'CG', name: 'Chhattisgarh', kind: 'State', capital: 'Raipur' },
  { code: 'GA', name: 'Goa', kind: 'State', capital: 'Panaji' },
  { code: 'GJ', name: 'Gujarat', kind: 'State', capital: 'Gandhinagar' },
  { code: 'HR', name: 'Haryana', kind: 'State', capital: 'Chandigarh' },
  { code: 'HP', name: 'Himachal Pradesh', kind: 'State', capital: 'Shimla' },
  { code: 'JH', name: 'Jharkhand', kind: 'State', capital: 'Ranchi' },
  { code: 'KA', name: 'Karnataka', kind: 'State', capital: 'Bengaluru' },
  { code: 'KL', name: 'Kerala', kind: 'State', capital: 'Thiruvananthapuram' },
  { code: 'MP', name: 'Madhya Pradesh', kind: 'State', capital: 'Bhopal' },
  { code: 'MH', name: 'Maharashtra', kind: 'State', capital: 'Mumbai' },
  { code: 'MN', name: 'Manipur', kind: 'State', capital: 'Imphal' },
  { code: 'ML', name: 'Meghalaya', kind: 'State', capital: 'Shillong' },
  { code: 'MZ', name: 'Mizoram', kind: 'State', capital: 'Aizawl' },
  { code: 'NL', name: 'Nagaland', kind: 'State', capital: 'Kohima' },
  { code: 'OD', name: 'Odisha', kind: 'State', capital: 'Bhubaneswar' },
  { code: 'PB', name: 'Punjab', kind: 'State', capital: 'Chandigarh' },
  { code: 'RJ', name: 'Rajasthan', kind: 'State', capital: 'Jaipur' },
  { code: 'SK', name: 'Sikkim', kind: 'State', capital: 'Gangtok' },
  { code: 'TN', name: 'Tamil Nadu', kind: 'State', capital: 'Chennai' },
  { code: 'TS', name: 'Telangana', kind: 'State', capital: 'Hyderabad' },
  { code: 'TR', name: 'Tripura', kind: 'State', capital: 'Agartala' },
  { code: 'UP', name: 'Uttar Pradesh', kind: 'State', capital: 'Lucknow' },
  { code: 'UK', name: 'Uttarakhand', kind: 'State', capital: 'Dehradun' },
  { code: 'WB', name: 'West Bengal', kind: 'State', capital: 'Kolkata' },
  { code: 'AN', name: 'Andaman and Nicobar Islands', kind: 'Union territory', capital: 'Sri Vijaya Puram' },
  { code: 'CH', name: 'Chandigarh', kind: 'Union territory', capital: 'Chandigarh' },
  { code: 'DD', name: 'Dadra and Nagar Haveli and Daman and Diu', kind: 'Union territory', capital: 'Daman' },
  { code: 'DL', name: 'Delhi', kind: 'Union territory', capital: 'New Delhi' },
  { code: 'JK', name: 'Jammu and Kashmir', kind: 'Union territory', capital: 'Srinagar / Jammu' },
  { code: 'LA', name: 'Ladakh', kind: 'Union territory', capital: 'Leh' },
  { code: 'LD', name: 'Lakshadweep', kind: 'Union territory', capital: 'Kavaratti' },
  { code: 'PY', name: 'Puducherry', kind: 'Union territory', capital: 'Puducherry' },
];

export function getRegion(code?: string | null) {
  return INDIA_REGIONS.find((region) => region.code === code?.toUpperCase()) ?? null;
}

export function getRegionByName(name?: string | null) {
  return INDIA_REGIONS.find((region) => region.name.toLowerCase() === name?.toLowerCase()) ?? null;
}

export function getSyntheticRegionLoad(code: string) {
  const seed = [...code].reduce((total, character) => total + character.charCodeAt(0), 0);
  const received = 38 + (seed * 17) % 173;
  const actionRequired = 2 + seed % 11;
  const atRisk = 1 + (seed * 3) % 9;
  const completionRate = 71 + seed % 24;
  return { received, actionRequired, atRisk, completionRate };
}
