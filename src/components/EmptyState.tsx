import { PackageX } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <PackageX size={48} className="text-slate-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        No Products Found
      </h3>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        We couldn't find any products matching your current filters. Try adjusting your search or filters.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Clear All Filters
      </button>
    </div>
  );
}
