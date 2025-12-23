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
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40 py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Product"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
            />
          </div>

          {/* Towel Types Dropdown - Only show when category is towels */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={`flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white cursor-pointer ${
                selectedCategory !== 'all' ? 'border-blue-600' : 'border-gray-300'
              }`}
            >
              <option value="all">All Categories</option>
              <option value="towels">Towels</option>
              <option value="cow-dung">Cow Dung Products</option>
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
                className={`flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white cursor-pointer ${
                  selectedTowelType ? 'border-blue-600' : 'border-gray-300'
                }`}
              >
                <option value="">All Towel Types</option>
                {towelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}

            {availableTypes.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                className={`flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white cursor-pointer ${
                  selectedType !== 'all' ? 'border-blue-600' : 'border-gray-300'
                }`}
              >
                <option value="all">
                  {selectedCategory === 'towels' && selectedTowelType ? 'All Subtypes' : 'All Types'}
                </option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
