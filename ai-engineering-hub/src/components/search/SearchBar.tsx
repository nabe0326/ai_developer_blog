'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchBar({ 
  placeholder = "記事を検索...", 
  className = "",
  autoFocus = false,
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    setQuery(currentQuery);
  }, [searchParams]);

  const debouncedSearch = useDebouncedCallback((searchQuery: string) => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      const params = new URLSearchParams(searchParams);
      if (searchQuery.trim()) {
        params.set('q', searchQuery);
        params.delete('page');
      } else {
        params.delete('q');
      }
      router.push(`/search?${params.toString()}`);
    }
  }, 300);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    debouncedSearch('');
  }, [debouncedSearch]);

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          autoFocus={autoFocus}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}