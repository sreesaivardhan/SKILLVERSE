'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

export const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 300,
  className = '',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const calculatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = childRect.top + scrollTop - tooltipRect.height - 8;
        left = childRect.left + scrollLeft + (childRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'right':
        top = childRect.top + scrollTop + (childRect.height / 2) - (tooltipRect.height / 2);
        left = childRect.right + scrollLeft + 8;
        break;
      case 'bottom':
        top = childRect.bottom + scrollTop + 8;
        left = childRect.left + scrollLeft + (childRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = childRect.top + scrollTop + (childRect.height / 2) - (tooltipRect.height / 2);
        left = childRect.left + scrollLeft - tooltipRect.width - 8;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position if needed
    if (left < 10) {
      left = 10;
    } else if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }

    // Adjust vertical position if needed
    if (top < 10) {
      top = 10;
    } else if (top + tooltipRect.height > viewportHeight + scrollTop - 10) {
      top = childRect.top + scrollTop - tooltipRect.height - 8;
    }

    setTooltipPosition({ top, left });
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after tooltip is visible
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition, true);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible]);

  return (
    <div
      className="inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      ref={childRef}
    >
      {children}
      {isMounted && isVisible && createPortal(
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-800 rounded shadow-lg pointer-events-none transition-opacity duration-200 ${className}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            opacity: isVisible ? 1 : 0,
          }}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45 ${
              position === 'top' ? 'bottom-0 -mb-1 left-1/2 -translate-x-1/2' :
              position === 'right' ? 'left-0 -ml-1 top-1/2 -translate-y-1/2' :
              position === 'bottom' ? 'top-0 -mt-1 left-1/2 -translate-x-1/2' :
              'right-0 -mr-1 top-1/2 -translate-y-1/2'
            }`}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default Tooltip;
