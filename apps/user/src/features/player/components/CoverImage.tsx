interface CoverImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function CoverImage({ src, alt, className = '' }: CoverImageProps) {
  return (
    <div className={`cover-image ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="cover-image__img" />
      ) : (
        <div className="cover-image__placeholder">
          <span className="cover-image__placeholder-text">No Image</span>
        </div>
      )}
    </div>
  );
}
