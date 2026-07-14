import { Star, StarHalf } from "lucide-react";

type StarRatingProps = Readonly<{
  rating: number;
  showValue?: boolean;
  className?: string;
}>;


export default function StarRating({
  rating,
  showValue = false,
  className = "",
}: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, rating));
  const full = Math.floor(clamped);
  const hasHalf = clamped - full >= 0.5;

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`Rated ${clamped.toFixed(1)} out of 5`}
    >
      <span aria-hidden="true" className="flex items-center text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) {
            return <Star key={i} className="h-4 w-4 fill-current" />;
          }
          if (i === full && hasHalf) {
            return <StarHalf key={i} className="h-4 w-4 fill-current" />;
          }
          return <Star key={i} className="h-4 w-4 text-slate-300" />;
        })}
      </span>
      {showValue && (
        <span className="text-sm text-slate-600">{clamped.toFixed(1)}</span>
      )}
    </div>
  );
}
