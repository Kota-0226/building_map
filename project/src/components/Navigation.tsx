import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, List, Heart } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const links = [
    { to: '/map', icon: Map, label: 'マップ' },
    { to: '/list', icon: List, label: 'リスト' },
    { to: '/favorites', icon: Heart, label: 'お気に入り' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center p-2 ${
                location.pathname === to ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};