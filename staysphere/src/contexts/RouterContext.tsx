import React, { createContext, useContext, useState, ReactNode } from 'react';

// Route types
export type Route = 
  | { name: 'home' }
  | { name: 'properties'; filters?: any }
  | { name: 'property'; id: string }
  | { name: 'host-dashboard' }
  | { name: 'create-property' }
  | { name: 'edit-property'; id: string }
  | { name: 'bookings' }
  | { name: 'profile' };

// Router context interface
interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
}

// Router context
const RouterContext = createContext<RouterContextType | undefined>(undefined);

// Router provider
interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>({ name: 'home' });
  const [routeHistory, setRouteHistory] = useState<Route[]>([{ name: 'home' }]);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    setRouteHistory(prev => [...prev, route]);
  };

  const goBack = () => {
    if (routeHistory.length > 1) {
      const newHistory = routeHistory.slice(0, -1);
      const previousRoute = newHistory[newHistory.length - 1];
      setRouteHistory(newHistory);
      setCurrentRoute(previousRoute);
    }
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
};

// Custom hook to use router
export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};