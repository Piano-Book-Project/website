interface SourceInfoProps {
  source: string;
  className?: string;
}

export function SourceInfo({ source, className = '' }: SourceInfoProps) {
  return (
    <div className={`source-info ${className}`}>
      <span className="source-info__text">PLAYING FROM: {source}</span>
    </div>
  );
}
