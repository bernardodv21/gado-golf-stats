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
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center min-h-16 py-2 md:py-0">
          <div className="flex items-center mb-2 md:mb-0">
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full border-2 border-green-600 flex items-center justify-center shadow-sm">
                  <div className="w-4 h-4 md:w-6 md:h-6 bg-green-600 rounded-full flex items-center justify-center relative">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-green-700 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-800 rounded-full"></div>
                    </div>
                    {/* Líneas de la pelota de golf */}
                    <div className="absolute w-full h-0.5 bg-green-800 opacity-30"></div>
                    <div className="absolute w-0.5 h-full bg-green-800 opacity-30"></div>
                  </div>
                </div>
              </div>
              <span className="ml-2 md:ml-3 text-lg md:text-xl font-bold text-gray-900">
                GADO Golf Stats
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2 md:space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{item.name}</span>
                  <span className="sm:hidden">{item.name.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
