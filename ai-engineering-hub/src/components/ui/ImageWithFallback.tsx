'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  categorySlug?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

const getFallbackImageByCategory = (categorySlug?: string) => {
  const categoryImageMap: Record<string, string> = {
    'implementation': '/image1.png',
    'research': '/image2.png',
    'efficiency': '/image3.png',
    'tips': '/image4.png',
  };
  
  if (categorySlug && categoryImageMap[categorySlug]) {
    return categoryImageMap[categorySlug];
  }
  
  return '/image1.png';
};

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc,
  categorySlug,
  priority = false,
  fill = false,
  sizes,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const finalFallback = fallbackSrc || getFallbackImageByCategory(categorySlug);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  // srcが空文字列またはnullの場合は即座にフォールバックを使用
  const imageSrc = src && src.trim() !== '' ? src : finalFallback;

  if (!imageSrc || imageSrc.trim() === '') {
    // 画像URLが全くない場合はプレースホルダーを表示
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  if (error) {
    if (finalFallback && finalFallback !== imageSrc) {
      return (
        <Image
          src={finalFallback}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          fill={fill}
          sizes={sizes}
          onError={() => {
            // フォールバック画像もエラーの場合はプレースホルダーを表示
          }}
          onLoad={handleLoad}
        />
      );
    }

    // フォールバック画像も失敗した場合のプレースホルダー
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div 
          className={`bg-gray-200 animate-pulse ${className}`}
          style={fill ? {} : { width, height }}
        />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        fill={fill}
        sizes={sizes}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}