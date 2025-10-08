import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const Star: React.FC<{
  filled: boolean;
  halfFilled?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  color: string;
  sizeClass: string;
}> = ({ filled, halfFilled, onClick, onMouseEnter, onMouseLeave, color, sizeClass }) => {
  const path = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
  const isInteractive = !!onClick;
  
  if (halfFilled) {
      return (
          <svg className={`${sizeClass} ${isInteractive ? 'cursor-pointer' : ''}`} viewBox="0 0 24 24">
              <defs>
                  <linearGradient id="half_grad">
                      <stop offset="50%" stopColor={color} />
                      <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
                  </linearGradient>
              </defs>
              <path fill="url(#half_grad)" d={path} />
          </svg>
      )
  }
  
  return (
    <svg onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`${sizeClass} ${filled ? '' : 'opacity-30'} ${isInteractive ? 'cursor-pointer' : ''}`} fill="currentColor" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  );
};

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const color = 'text-secondary-focus';
  const sizeClass = sizeClasses[size];

  const handleRating = (rate: number) => {
    if (onRatingChange) {
      onRatingChange(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (onRatingChange) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (onRatingChange) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex items-center ${color}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const displayRating = onRatingChange ? (hoverRating || rating) : rating;
        const isFilled = displayRating >= star;
        const isHalfFilled = !onRatingChange && rating > star - 1 && rating < star;

        return (
          <Star
            key={star}
            filled={isFilled}
            halfFilled={isHalfFilled}
            onClick={() => handleRating(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            color={color}
            sizeClass={sizeClass}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
