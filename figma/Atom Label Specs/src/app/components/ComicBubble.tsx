import React from 'react';

type PointerPosition = 
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'top-left' | 'top-center' | 'top-right'
  | 'left-top' | 'left-center' | 'left-bottom'
  | 'right-top' | 'right-center' | 'right-bottom';

interface ComicBubbleProps {
  children: React.ReactNode;
  pointerPosition: PointerPosition;
  backgroundColor: string;
  borderColor: string;
  borderWidth?: number;
  className?: string;
}

export function ComicBubble({
  children,
  pointerPosition,
  backgroundColor,
  borderColor,
  borderWidth = 2,
  className = ''
}: ComicBubbleProps) {
  
  const getPointerSVG = () => {
    const strokeWidth = borderWidth;
    
    switch (pointerPosition) {
      case 'bottom-left':
        return (
          <svg 
            className="absolute left-5 -bottom-4" 
            width="24" 
            height="16" 
            viewBox="0 0 24 16"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 0 16 L 24 0 L 24 0" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'bottom-center':
        return (
          <svg 
            className="absolute left-1/2 -translate-x-1/2 -bottom-4" 
            width="24" 
            height="16" 
            viewBox="0 0 24 16"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 0 0 L 12 16 L 24 0" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'bottom-right':
        return (
          <svg 
            className="absolute right-5 -bottom-4" 
            width="24" 
            height="16" 
            viewBox="0 0 24 16"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 24 16 L 0 0 L 0 0" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'top-left':
        return (
          <svg 
            className="absolute left-5 -top-4" 
            width="24" 
            height="16" 
            viewBox="0 0 24 16"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 0 0 L 24 16 L 24 16" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'top-center':
        return (
          <svg 
            className="absolute left-1/2 -translate-x-1/2 -top-4" 
            width="24" 
            height="16" 
            viewBox="0 0 24 16"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 0 16 L 12 0 L 24 16" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'top-right':
        return (
          <svg 
            className="absolute right-5 -top-4" 
            width="24" 
            height="16" 
            viewBox="0 0 24 16"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 24 0 L 0 16 L 0 16" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'left-top':
        return (
          <svg 
            className="absolute -left-4 top-5" 
            width="16" 
            height="24" 
            viewBox="0 0 16 24"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 0 0 L 16 24 L 16 24" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'left-center':
        return (
          <svg 
            className="absolute -left-4 top-1/2 -translate-y-1/2" 
            width="16" 
            height="24" 
            viewBox="0 0 16 24"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 16 0 L 0 12 L 16 24" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'left-bottom':
        return (
          <svg 
            className="absolute -left-4 bottom-5" 
            width="16" 
            height="24" 
            viewBox="0 0 16 24"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 0 24 L 16 0 L 16 0" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'right-top':
        return (
          <svg 
            className="absolute -right-4 top-5" 
            width="16" 
            height="24" 
            viewBox="0 0 16 24"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 16 0 L 0 24 L 0 24" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'right-center':
        return (
          <svg 
            className="absolute -right-4 top-1/2 -translate-y-1/2" 
            width="16" 
            height="24" 
            viewBox="0 0 16 24"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 0 0 L 16 12 L 0 24" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'right-bottom':
        return (
          <svg 
            className="absolute -right-4 bottom-5" 
            width="16" 
            height="24" 
            viewBox="0 0 16 24"
            style={{ overflow: 'visible' }}
          >
            <path 
              d="M 16 24 L 0 0 L 0 0" 
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {getPointerSVG()}
      {children}
    </div>
  );
}
