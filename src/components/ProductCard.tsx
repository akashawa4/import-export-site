import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  imageEmoji: string;
  highlight?: string;
}

export default function ProductCard({ name, category, description, price, imageEmoji, highlight }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
      <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
          {imageEmoji}
        </div>
        {highlight && (
          <div className="absolute top-3 right-3 bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            {highlight}
          </div>
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
