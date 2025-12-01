import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  name: string;
  category: string;
  description: string;
  price: string;
  imageEmoji: string;
  imageUrl?: string;
  highlight?: string;
  showAdminControls?: boolean;
  onEdit?: () => void;
  onClick?: () => void;
}

export default function ProductCard({
  name,
  category,
  description,
  price,
  imageEmoji,
  imageUrl,
  highlight,
  showAdminControls,
  onEdit,
  onClick,
}: ProductCardProps) {
  const hasImage = Boolean(imageUrl);

  return (
    <div
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
            <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
              {imageEmoji}
            </div>
          </div>
        )}

        {highlight && (
          <div className="absolute top-3 right-3 bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            {highlight}
          </div>
        )}

        {showAdminControls && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow hover:bg-white"
          >
            Edit
          </button>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs text-amber-600 font-medium mb-2 uppercase tracking-wide">
          {category}
        </p>
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="font-bold text-slate-900 text-xl">
            {price}
          </p>
          <div className="flex items-center gap-1 text-amber-600">
            <span className="text-sm font-semibold">★</span>
            <span className="text-sm font-medium">4.6</span>
          </div>
        </div>
      </div>
    </div>
  );
}
