
interface ProductCardProps {
  name: string;
  category: string;
  description: string;
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
      className="group bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-blue-400/40 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-96 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-96 sm:h-80 w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
            <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
              {imageEmoji}
            </div>
          </div>
        )}

        {highlight && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
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

      <div className="p-5 bg-slate-900/50 backdrop-blur-sm">
        <p className="text-xs text-blue-400 font-medium mb-2 uppercase tracking-wide">
          {category}
        </p>
        <h3 className="text-lg font-bold font-serif text-white mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-slate-300 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>
      </div>
    </div>
  );
}
