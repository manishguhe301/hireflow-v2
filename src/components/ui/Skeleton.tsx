'use client';

import clsx from 'clsx';

type SkeletonVariant = 'rectangular' | 'rounded' | 'circle';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  animation?: SkeletonAnimation;
  className?: string;
}

export default function Skeleton({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className,
}: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const variantClasses = {
    rectangular: 'rounded-md',
    rounded: 'rounded-xl',
    circle: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  return (
    <div
      style={style}
      className={clsx(
        'relative overflow-hidden bg-muted-foreground/10', 
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  );
}