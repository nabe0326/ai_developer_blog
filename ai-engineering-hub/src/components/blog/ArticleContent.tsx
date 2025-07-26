'use client'

import ArticleContentClient from './ArticleContentClient'

interface ArticleContentProps {
  content: string
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return <ArticleContentClient content={content} />
}