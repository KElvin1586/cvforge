import { useEffect, useState } from 'react';

export type Route = 'landing' | 'app' | 'checkout';

export function parseRoute(hash: string): Route {
  if (hash.startsWith('#/app')) return 'app';
  if (hash.startsWith('#/checkout')) return 'checkout';
  // '#/', '#/features', '#/pricing', empty, unknown → landing page
  return 'landing';
}

const TITLES: Record<Route, string> = {
  landing: 'CVForge — Professional CV & Resume Builder',
  app: 'CVForge — CV Editor',
  checkout: 'CVForge — Development Test Checkout',
};

/** Tiny hash router — no dependencies, shareable URLs, no server config. */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(window.location.hash),
  );

  useEffect(() => {
    // Title is set synchronously from the event (not from render) so it can
    // never lag one navigation behind.
    const apply = () => {
      const r = parseRoute(window.location.hash);
      setRoute(r);
      document.title = TITLES[r];
    };
    window.addEventListener('hashchange', apply);
    apply();
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  return route;
}
