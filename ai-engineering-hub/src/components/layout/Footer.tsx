'use client'

import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCategories } from '@/lib/microcms'
import { Category } from '@/types/microcms'

const footerLinks = {
  site: [
    { name: 'Home', href: '/' },
    { name: 'Articles', href: '/articles' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
  ],
}

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/nabe0326', icon: Github },
  { name: 'Twitter', href: 'https://x.com/nabe_AI_dev', icon: Twitter },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // カテゴリ一覧を取得
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        setCategories(response.contents)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Site Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">実践AI技術ブログ</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              エンジニアと企業向けのAI技術情報。
              開発事例、ツール比較、導入ノウハウから最新トレンドまで実践的な情報を発信。
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-accent-500 transition-colors duration-200"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Site Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
              サイト
            </h4>
            <ul className="space-y-2">
              {footerLinks.site.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
              カテゴリ
            </h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} 実践AI技術ブログ. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 sm:mt-0">
              Built with Next.js & MicroCMS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}