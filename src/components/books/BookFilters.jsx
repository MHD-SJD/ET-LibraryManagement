import React from 'react';
import { CATEGORIES } from '../../data/mockBooks';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export const BookFilters = ({
  selectedCategory,
  onSelectCategory,
  availability,
  onSelectAvailability,
  sortBy,
  onSelectSortBy,
  onReset
}) => {
  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                  : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Secondary filter controls (Availability, Sort, Reset) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
            Filter:
          </span>
          <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/70">
            <button
              onClick={() => onSelectAvailability('all')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                availability === 'all'
                  ? 'bg-white text-navy-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => onSelectAvailability('available')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                availability === 'available'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Now
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSelectSortBy(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Published</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="title-desc">Title (Z - A)</option>
              <option value="copies">Most Copies Available</option>
            </select>
          </div>

          <button
            onClick={onReset}
            title="Reset filters"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
