'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'rectangle';
  width?: string | number;
  height?: string | number;
  repeat?: number;
  animated?: boolean;
}

export const Skeleton = ({
  className,
  variant = 'rectangle',
  width,
  height,
  animated = true,
}: SkeletonProps) => {
  const baseClasses = cn(
    'bg-gray-200 dark:bg-gray-700',
    animated ? 'animate-pulse' : '',
    variant === 'circle' ? 'rounded-full' : 'rounded',
    className
  );

  const styles = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return <div className={baseClasses} style={styles} />;
};

export const SkeletonText = ({ className, width, animated = true }: SkeletonProps) => {
  return (
    <Skeleton
      variant="rectangle"
      className={cn('h-4 my-2', className)}
      width={width}
      animated={animated}
    />
  );
};

export const SkeletonCircle = ({ className, size = 40, animated = true }: SkeletonProps & { size?: number }) => {
  return (
    <Skeleton
      variant="circle"
      className={className}
      width={size}
      height={size}
      animated={animated}
    />
  );
};

export const SkeletonCard = ({ className }: SkeletonProps) => {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md p-6', className)}>
      <Skeleton className="h-6 w-3/4 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-6 flex items-center">
        <SkeletonCircle size={40} />
        <div className="ml-3 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
};

interface SkeletonGridProps {
  count?: number;
  className?: string;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const SkeletonCardGrid = ({
  count = 4,
  className,
  columns = {
    default: 1,
    sm: 2,
    lg: 3,
    xl: 4,
  },
}: SkeletonGridProps) => {
  const gridClassName = cn(
    'grid gap-6',
    `grid-cols-${columns.default || 1}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className
  );

  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonCard,
  SkeletonCardGrid,
};
