import { useNavigate } from 'react-router-dom';
import { LogOut, Settings2, UserRound } from 'lucide-react';
import { useAuth, useLogout } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function initials(name?: string, email?: string): string {
  const source = name?.trim() || email?.split('@')[0] || 'A';
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  return (parts[0]?.[0] ?? 'A').concat(parts[1]?.[0] ?? '').toUpperCase();
}

export function ProfileMenu() {
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-10 items-center gap-2 pl-1.5 pr-2.5"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{initials(user?.name, user?.email)}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
            {user?.name || user?.email || 'Account'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5 normal-case">
          <span className="text-sm font-semibold text-foreground">
            {user?.name || 'Administrator'}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <UserRound className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings2 className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
