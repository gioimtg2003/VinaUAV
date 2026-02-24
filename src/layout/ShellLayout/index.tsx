import AppSidebar from '@/components/common/Sidebar';
import Topbar from '@/components/common/TopBar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TOP_SAFE_AREA_PADDING } from '@/constants';
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom';

export default function ShellLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
        className={cn(
          'h-screen flex flex-col overflow-hidden  select-none  ',
          TOP_SAFE_AREA_PADDING
        )}
      >
        <div className='flex flex-1 min-h-0 overflow-hidden no-scroll'>
          <Topbar />
          <main className=' relative flex-1 touch-none  max-w-450 overflow-hidden bg-background'>
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
