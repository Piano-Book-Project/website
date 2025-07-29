interface MoreMenuProps {
  onMenuClick?: (action: string) => void;
  className?: string;
}

export function MoreMenu({ onMenuClick, className = '' }: MoreMenuProps) {
  const handleClick = (action: string) => {
    onMenuClick?.(action);
  };

  return (
    <div className={`more-menu ${className}`}>
      <button
        className="more-menu__button"
        onClick={() => handleClick('more')}
        aria-label="More options"
        type="button"
      >
        <span className="more-menu__icon">⋯</span>
      </button>
    </div>
  );
}
