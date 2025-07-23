'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/microcms';
import { type SearchFilters, SEARCH_CONSTANTS, buildSearchParams, parseSearchParams } from '@/lib/search';

interface SearchFiltersProps {
  categories: Category[];
  availableTags: string[];
  onFiltersChange?: (filters: SearchFilters) => void;
}

export function SearchFilters({ categories, availableTags, onFiltersChange }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    const options = parseSearchParams(searchParams);
    setFilters(options.filters);
  }, [searchParams]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    } else {
      const params = buildSearchParams({ filters: updatedFilters, page: 1 });
      const queryString = new URLSearchParams(params).toString();
      router.push(`/search?${queryString}`);
    }
  }, [filters, onFiltersChange, router]);

  const clearFilters = useCallback(() => {
    const clearedFilters = { query: filters.query };
    setFilters(clearedFilters);
    
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    } else {
      const params = new URLSearchParams();
      if (filters.query) {
        params.set('q', filters.query);
      }
      const queryString = params.toString();
      router.push(`/search?${queryString}`);
    }
  }, [filters.query, onFiltersChange, router]);

  const toggleTag = useCallback((tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    updateFilters({ tags: newTags.length > 0 ? newTags : undefined });
  }, [filters.tags, updateFilters]);

  const hasActiveFilters = !!(
    filters.category ||
    filters.tags?.length ||
    filters.contentType ||
    filters.targetAudience ||
    filters.difficultyLevel
  );

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">フィルター</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-accent-600 hover:text-accent-700"
            >
              クリア
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* カテゴリフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリ
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => updateFilters({ category: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="">すべてのカテゴリ</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* コンテンツタイプフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            コンテンツタイプ
          </label>
          <select
            value={filters.contentType || ''}
            onChange={(e) => updateFilters({ contentType: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="">すべてのタイプ</option>
            {SEARCH_CONSTANTS.CONTENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* ターゲット読者フィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ターゲット読者
          </label>
          <select
            value={filters.targetAudience || ''}
            onChange={(e) => updateFilters({ targetAudience: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="">すべての読者</option>
            {SEARCH_CONSTANTS.TARGET_AUDIENCES.map((audience) => (
              <option key={audience.value} value={audience.value}>
                {audience.label}
              </option>
            ))}
          </select>
        </div>

        {/* 難易度フィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            難易度
          </label>
          <select
            value={filters.difficultyLevel || ''}
            onChange={(e) => updateFilters({ difficultyLevel: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="">すべての難易度</option>
            {SEARCH_CONSTANTS.DIFFICULTY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* タグフィルター */}
        {availableTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ
            </label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.tags?.includes(tag)
                      ? 'bg-accent-500 text-white border-accent-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* アクティブフィルターの表示 */}
        {hasActiveFilters && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選択中のフィルター
            </label>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  カテゴリ: {categories.find(c => c.slug === filters.category)?.name}
                  <button
                    onClick={() => updateFilters({ category: undefined })}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.contentType && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  タイプ: {SEARCH_CONSTANTS.CONTENT_TYPES.find(t => t.value === filters.contentType)?.label}
                  <button
                    onClick={() => updateFilters({ contentType: undefined })}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.targetAudience && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                  読者: {SEARCH_CONSTANTS.TARGET_AUDIENCES.find(a => a.value === filters.targetAudience)?.label}
                  <button
                    onClick={() => updateFilters({ targetAudience: undefined })}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.difficultyLevel && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                  難易度: {SEARCH_CONSTANTS.DIFFICULTY_LEVELS.find(l => l.value === filters.difficultyLevel)?.label}
                  <button
                    onClick={() => updateFilters({ difficultyLevel: undefined })}
                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.tags?.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                  タグ: {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1 text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}