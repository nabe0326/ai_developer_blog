'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { Menu, X, ChevronDown, Folder } from 'lucide-react'
import { getCategories } from '@/lib/microcms'
import { Category } from '@/types/microcms'
import { SearchBar } from '@/components/search/SearchBar'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/articles' },
  { name: 'About', href: '/about' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // カテゴリ一覧を取得
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from MicroCMS...')
        const response = await getCategories()
        console.log('Categories response:', response)
        console.log('Categories details:', response.contents.map(c => ({ 
          id: c.id, 
          name: c.name, 
          slug: c.slug,
          description: c.description,
          hasName: !!c.name,
          hasSlug: !!c.slug
        })))
        setCategories(response.contents)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // APIの詳細な情報をログ出力
        if (error instanceof Error) {
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
        }
        // エラー時は空配列を設定して続行
        setCategories([])
      }
    }
    
    // 初回マウント時のみ実行
    fetchCategories()
  }, [])

  return (
    <header className="bg-primary-900 text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="!text-white font-bold text-xl hover:text-gray-100 transition-colors">
              実践AI技術ブログ
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="!text-white hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
                className="flex items-center !text-white hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Categories
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {isCategoriesOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <Link
                    href="/categories"
                    className="flex items-center px-4 py-2 text-sm !text-gray-700 hover:bg-gray-100 hover:!text-gray-900 transition-colors duration-200"
                  >
                    <Folder className="w-4 h-4 mr-3 text-accent-500" />
                    すべてのカテゴリを見る
                  </Link>
                  
                  {categories.length > 0 && (
                    <>
                      <hr className="my-2" />
                      {categories.slice(0, 6).map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug || category.id}`}
                          className="block px-4 py-2 text-sm !text-gray-700 hover:bg-gray-100 hover:!text-gray-900 transition-colors duration-200"
                        >
                          {category.name || 'Untitled Category'}
                          {!category.slug && <span className="text-xs text-red-500 ml-2">(no slug)</span>}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Search and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Search Box */}
            <div className="hidden sm:block w-64">
              <Suspense fallback={<div className="w-full h-8 bg-gray-200 rounded animate-pulse" />}>
                <SearchBar className="w-full" />
              </Suspense>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="!text-white hover:text-gray-100 p-2"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-gray-100 block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Categories Section */}
              <div className="border-t border-gray-700 mt-4 pt-4">
                <div className="px-3 py-2">
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                    Categories
                  </h3>
                  <Link
                    href="/categories"
                    className="flex items-center text-white hover:text-gray-100 py-2 text-sm transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Folder className="w-4 h-4 mr-3" />
                    すべてのカテゴリを見る
                  </Link>
                  
                  {categories.slice(0, 5).map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug || category.id}`}
                      className="block text-white hover:text-gray-100 py-2 pl-7 text-sm transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name || 'Untitled Category'}
                      {!category.slug && <span className="text-xs text-red-400 ml-2">(no slug)</span>}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Mobile Search */}
              <div className="px-3 py-2 border-t border-gray-700 mt-4 pt-4">
                <Suspense fallback={<div className="w-full h-8 bg-gray-200 rounded animate-pulse" />}>
                  <SearchBar className="w-full" />
                </Suspense>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}