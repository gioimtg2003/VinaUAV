import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Sparkles } from '@react-three/drei';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Drone,
  LogOut,
} from 'lucide-react';
import NavMain from './NavMain';

export default function AppSidebar() {
  const { isMobile } = useSidebar();

  return (
    <Sidebar
      collapsible='icon'
      classNameInner='bg-background/60'
      className='bg-surface select-none '
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton
            data-tauri-drag-region
            size='lg'
            asChild
            className='hover:bg-surface active:bg-surbg-surface'
          >
            <div className='flex items-center gap-2'>
              <Drone
                className='size-8! text-text-main'
                strokeWidth={2.25}
                absoluteStrokeWidth
              />
              <div className='flex flex-col gap-0.5 text-text-main leading-none'>
                <span className='font-medium'>VinaUAV</span>
                <span className='text-xs'>v{}</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter className='text-text-main'>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground  pointer-events-none'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                    <AvatarFallback className='rounded-lg'>Free</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>Free User</span>
                    <span className='truncate text-xs'>none@gmail.com</span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side={isMobile ? 'bottom' : 'right'}
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                      <AvatarFallback className='rounded-lg'>
                        Free
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-medium'>Free User</span>
                      <span className='truncate text-xs'>none@gmail.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
