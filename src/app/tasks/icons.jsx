import { 
  Coffee, 
  Utensils, 
  User, 
  Tool, 
  Briefcase, 
  Bed, 
  Shield, 
  CalendarRange,
  Cocktail,
  Bell,
  Map
} from 'lucide-react';

export const DEPARTMENT_ICONS = {
  'Front Desk': User,
  'Housekeeping': Bed,
  'Kitchen': Utensils,
  'Dining': Cocktail,
  'Maintenance': Tool,
  'Guest Services': Bell,
  'Security': Shield,
  'Events': CalendarRange,
  'Bar': Coffee,
  'Management': Briefcase,
  // Default icon for unknown departments
  'default': Map
};

export const DEPARTMENT_COLORS = {
  'Front Desk': 'text-blue-500',
  'Housekeeping': 'text-green-500',
  'Kitchen': 'text-orange-500',
  'Dining': 'text-purple-500',
  'Maintenance': 'text-yellow-500',
  'Guest Services': 'text-indigo-500',
  'Security': 'text-red-500',
  'Events': 'text-pink-500',
  'Bar': 'text-amber-500',
  'Management': 'text-cyan-500',
  'default': 'text-gray-500'
};

export const getDepartmentIcon = (department) => {
  const Icon = DEPARTMENT_ICONS[department] || DEPARTMENT_ICONS.default;
  const colorClass = DEPARTMENT_COLORS[department] || DEPARTMENT_COLORS.default;
  
  return { Icon, colorClass };
};
