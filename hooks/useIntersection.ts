'use client';
import { useEffect, useRef, useState } from 'react';

export function useIntersection(
  options: IntersectionObserverInit = { threshold: 0 }
): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return [ref, isIntersecting];
}
