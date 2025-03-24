import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
  showAdvanced?: boolean;
}

export interface SearchFilters {
  query: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'newest' | 'oldest' | 'popular';
  tags: string[];
}

export default function SearchBar({ onSearch, className = '', showAdvanced = true }: SearchBarProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    dateRange: 'all',
    sortBy: 'newest',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    onSearch(filters);
  }, [filters]);

  const handleAddTag = () => {
    if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts..."
          value={filters.query}
          onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          className="input-retro w-full pl-12 pr-4 py-3"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-ink)] opacity-60" />
        {showAdvanced && (
          <button
            onClick={() => setIsAdvancedOpen(prev => !prev)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-ink)] hover:text-[var(--color-accent)]"
          >
            {isAdvancedOpen ? 'Simple' : 'Advanced'}
          </button>
        )}
      </div>

      {showAdvanced && isAdvancedOpen && (
        <div className="mt-4 p-4 border-2 border-[var(--color-ink)] bg-[var(--color-paper)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-serif font-medium text-[var(--color-ink)] mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as SearchFilters['dateRange'] }))}
                className="input-retro w-full"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-serif font-medium text-[var(--color-ink)] mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }))}
                className="input-retro w-full"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-serif font-medium text-[var(--color-ink)] mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-ink)] text-[var(--color-paper)] text-sm font-serif"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-[var(--color-accent)]"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="input-retro flex-1"
              />
              <button
                onClick={handleAddTag}
                className="btn-retro px-4"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}