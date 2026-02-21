import AppSidebar from '@/components/common/Sidebar';
import Topbar from '@/components/common/TopBar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

export default function ShellLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className=' h-[calc(100vh-50px)] overflow-hidden bg-background mt-12.5'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
