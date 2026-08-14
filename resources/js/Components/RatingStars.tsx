import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
    rating: number;
    size?: number;
    showValue?: boolean;
    count?: number;
}

export default function RatingStars({ rating, size = 14, showValue = false, count }: RatingStarsProps) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star
                        key={i}
                        size={size}
                        className={i <= fullStars ? 'text-amber-400 fill-amber-400' :
                            (i === fullStars + 1 && hasHalf) ? 'text-amber-400 fill-amber-200' :
                            'text-neutral-300 fill-neutral-100'}
                    />
                ))}
            </div>
            {showValue && (
                <span className="text-sm font-semibold text-neutral-900 ml-0.5">{rating.toFixed(1)}</span>
            )}
            {count !== undefined && (
                <span className="text-sm text-neutral-500">({count.toLocaleString('id-ID')} ulasan)</span>
            )}
        </div>
    );
}
