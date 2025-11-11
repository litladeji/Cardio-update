import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl mb-4 shadow-sm">
        <Icon className="w-16 h-16 text-blue-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 max-w-sm mx-auto mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
