import React from 'react';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { Button } from '../ui/button';

export function Header() {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="text-sm font-medium text-muted-foreground">
        Welcome back, Store Owner
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
