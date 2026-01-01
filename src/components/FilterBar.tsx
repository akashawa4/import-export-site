import { Search } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedType: string;
  onTypeChange: ((type: string) => void) | Dispatch<SetStateAction<string>>;
  availableTypes: string[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTowelType?: string;
  onTowelTypeChange?: (type: string) => void;
  towelTypes?: string[];
}

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  availableTypes,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  selectedTowelType = '',
  onTowelTypeChange,
  towelTypes = [],
}: FilterBarProps) {
  return (
    <div className="bg-transparent sticky top-16 z-40 py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search Product"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm md:text-base border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-md text-white placeholder-slate-400"
            />
          </div>

          {/* Towel Types Dropdown - Only show when category is towels */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={`flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800/80 backdrop-blur-md text-white cursor-pointer ${selectedCategory !== 'all' ? 'border-blue-500' : 'border-white/20'
                }`}
            >
              <option value="all" className="bg-slate-800 text-white">All Categories</option>
              <option value="towels" className="bg-slate-800 text-white">Towels</option>
              <option value="cow-dung" className="bg-slate-800 text-white">Cow Dung Products</option>
            </select>

            {selectedCategory === 'towels' && towelTypes.length > 0 && (
              <select
                value={selectedTowelType}
                onChange={(e) => {
                  if (onTowelTypeChange) {
                    onTowelTypeChange(e.target.value);
                    onTypeChange('all');
                  }
                }}
                className={`flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800/80 backdrop-blur-md text-white cursor-pointer ${selectedTowelType ? 'border-blue-500' : 'border-white/20'
                  }`}
              >
                <option value="" className="bg-slate-800 text-white">All Towel Types</option>
                {towelTypes.map((type) => (
                  <option key={type} value={type} className="bg-slate-800 text-white">
                    {type}
                  </option>
                ))}
              </select>
            )}

            {availableTypes.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                className={`flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800/80 backdrop-blur-md text-white cursor-pointer ${selectedType !== 'all' ? 'border-blue-500' : 'border-white/20'
                  }`}
              >
                <option value="all" className="bg-slate-800 text-white">
                  {selectedCategory === 'towels' && selectedTowelType ? 'All Subtypes' : 'All Types'}
                </option>
                {availableTypes.map((type) => (
                  <option key={type} value={type} className="bg-slate-800 text-white">
                    {type}
                  </option>
                ))}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800/80 backdrop-blur-md text-white cursor-pointer"
            >
              <option value="newest" className="bg-slate-800 text-white">Newest</option>
              <option value="name" className="bg-slate-800 text-white">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
