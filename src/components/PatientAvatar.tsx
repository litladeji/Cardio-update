import { User } from 'lucide-react';

interface PatientAvatarProps {
  name: string;
  status?: 'online' | 'warning' | 'critical' | 'offline';
  size?: 'sm' | 'md' | 'lg';
}

export function PatientAvatar({ name, status, size = 'md' }: PatientAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  // Generate a consistent color based on name
  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-cyan-400 to-cyan-600',
    'from-teal-400 to-teal-600'
  ];
  
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div className="relative inline-block">
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          bg-gradient-to-br ${colors[colorIndex]}
          flex items-center justify-center
          text-white
          shadow-lg
          ring-2 ring-white
        `}
      >
        {initials || <User className="w-1/2 h-1/2" />}
      </div>
    </div>
  );
}
