import React from 'react';

export function SourceInfo({ source }: { source?: string }) {
  return <div className="source-info">PLAYING FROM: {source || 'COEXIST'}</div>;
}
