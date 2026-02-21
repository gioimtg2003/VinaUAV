import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import {
  GamepadDirectional,
  Gauge,
  ListChecks,
  MonitorCheck,
  SquareChartGantt,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

export const MENU_ITEMS = [
  {
    label: 'Tổng quan',
    path: ROUTES.OVERVIEW,
    icon: <SquareChartGantt size={18} className='text-rose-400' />,
  },
  {
    label: 'Hiệu chỉnh',
    path: ROUTES.CALI_SENSOR,
    icon: <Gauge size={18} className='text-purple-400' />,
  },
  {
    label: 'Thử motor',
    path: ROUTES.MOTOR_TEST,
    icon: <ListChecks size={18} className='text-orange-400' />,
  },
  {
    label: 'Điều chỉnh PID',
    path: ROUTES.PID_TUNNING,
    icon: <MonitorCheck size={18} className='text-emerald-400' />,
  },
  {
    label: 'Điều khiển RC',
    path: ROUTES.INPUT_RC,
    icon: <GamepadDirectional size={18} className='text-blue-400' />,
  },
];

export default function NavMain() {
  const location = useLocation();

  return (
    <SidebarMenu className='gap-4 border-t border-t-button-primary mt-2 pt-4'>
      {MENU_ITEMS.map((item) => (
        <SidebarMenuItem key={item.path}>
          <NavLink to={item.path}>
            <SidebarMenuButton
              tooltip={item?.label}
              className={cn(
                'text-text-main rounded-xs',
                location.pathname === item.path ? 'bg-sidebar-accent/60' : ''
              )}
            >
              {item.icon}
              <span className='text-text-main'>{item.label}</span>
            </SidebarMenuButton>
          </NavLink>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
