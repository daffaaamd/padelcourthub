import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Star, Wifi, Car, ShowerHead, Coffee, Package, Lock } from 'lucide-react';

const facilityIcons: Record<string, React.ComponentType<any>> = {
    'Parking': Car,
    'Shower': ShowerHead,
    'Locker': Lock,
    'Cafe': Coffee,
    'WiFi': Wifi,
    'Rental Raket': Package,
};

interface VenueCardProps {
    venue: {
        id: number;
        name: string;
        slug: string;
        city: string;
        address?: string;
        cover_image_url: string;
        facilities: string[];
        average_rating: number;
        reviews_count: number;
        starting_price: number;
        courts_count: number;
        has_indoor?: boolean;
        has_outdoor?: boolean;
    };
    className?: string;
}

export default function VenueCard({ venue, className = '' }: VenueCardProps) {
    return (
        <div className={`card-hover group ${className}`}>
            {/* Image */}
            <div className="relative overflow-hidden h-48">
                <img
                    src={venue.cover_image_url}
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {(venue.has_indoor || venue.has_outdoor) && (
                    <div className="absolute top-3 left-3 flex gap-1.5">
                        {venue.has_indoor && (
                            <span className="text-xs bg-white/95 text-primary font-medium px-2 py-0.5 rounded-full shadow-sm">
                                Indoor
                            </span>
                        )}
                        {venue.has_outdoor && (
                            <span className="text-xs bg-white/95 text-accent-700 font-medium px-2 py-0.5 rounded-full shadow-sm">
                                Outdoor
                            </span>
                        )}
                    </div>
                )}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-full shadow-sm">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-neutral-900">{venue.average_rating}</span>
                    <span className="text-xs text-neutral-500">({venue.reviews_count})</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-neutral-900 text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {venue.name}
                </h3>
                <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-3">
                    <MapPin size={12} className="flex-shrink-0" />
                    <span>{venue.city}</span>
                    <span className="text-neutral-300">·</span>
                    <span>{venue.courts_count} Court</span>
                </div>

                {/* Facilities */}
                {venue.facilities && venue.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {venue.facilities.slice(0, 4).map(facility => {
                            const Icon = facilityIcons[facility];
                            return (
                                <span key={facility} className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                                    {Icon && <Icon size={10} />}
                                    {facility}
                                </span>
                            );
                        })}
                        {venue.facilities.length > 4 && (
                            <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                                +{venue.facilities.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs text-neutral-400">Mulai dari</span>
                        <p className="text-sm font-bold text-primary">
                            Rp {venue.starting_price > 0 ? new Intl.NumberFormat('id-ID').format(venue.starting_price) : '—'}/jam
                        </p>
                    </div>
                    <Link
                        href={route('venues.show', venue.slug)}
                        className="btn-primary text-xs py-2 px-4"
                    >
                        Lihat Venue
                    </Link>
                </div>
            </div>
        </div>
    );
}
