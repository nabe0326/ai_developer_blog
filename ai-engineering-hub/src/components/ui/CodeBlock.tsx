'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  className?: string
}

export default function CodeBlock({ code, language = 'text', filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className={`relative group my-6 ${className || ''}`}>
      {/* Header with filename and language */}
      {(filename || language !== 'text') && (
        <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-t-lg border-b border-gray-700">
          <div className="flex items-center space-x-3">
            {filename && (
              <span className="text-gray-300 text-sm font-mono">
                {filename}
              </span>
            )}
            {language !== 'text' && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-mono rounded">
                {language.toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors duration-200 text-sm"
            title="コードをコピー"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>コピー</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        {/* Copy button for headerless code blocks */}
        {!filename && language === 'text' && (
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 z-10 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
            title="コードをコピー"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
        
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: (filename || language !== 'text') ? '0 0 0.5rem 0.5rem' : '0.5rem',
            fontSize: '14px',
            lineHeight: '1.6',
            padding: '1.25rem',
          }}
          showLineNumbers={false}
          wrapLines={true}
          PreTag="div"
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}