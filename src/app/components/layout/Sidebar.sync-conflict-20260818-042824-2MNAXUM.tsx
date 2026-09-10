import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Settings, History, ShieldAlert, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const navItems = [
    { icon: LayoutDashboard, label: '대시보드', to: '/' },
    { icon: ShoppingBag, label: '상품 관리', to: '/products' },
    { icon: History, label: '로그', to: '/logs' },
    { icon: Settings, label: '설정', to: '/settings' },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <div className="flex items-center">
          <ShieldAlert className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold tracking-tight">PriceGuard</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">시스템 상태</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-foreground">모니터링 중</span>
          </div>
        </div>
      </div>
    </div>
  );
}
