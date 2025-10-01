'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Circle, Play } from 'lucide-react';
import clsx from 'clsx';

export default function Navigation() {
  const pathname = usePathname();

  const navigation = [
    { name: 'HOME', href: '/', icon: Home },
    { name: 'Rondas', href: '/rounds', icon: Play },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-full border-2 border-green-600 flex items-center justify-center shadow-sm">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center relative">
                    <div className="w-4 h-4 bg-green-700 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-800 rounded-full"></div>
                    </div>
                    {/* Líneas de la pelota de golf */}
                    <div className="absolute w-full h-0.5 bg-green-800 opacity-30"></div>
                    <div className="absolute w-0.5 h-full bg-green-800 opacity-30"></div>
                  </div>
                </div>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                GADO Golf Stats
              </span>
            </div>
          </div>
          
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
