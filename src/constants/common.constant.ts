import { MotorPosition, MotorState } from '@/components/common/Drone/type';
import {
  Activity,
  Compass,
  Gauge,
  Layers,
  Rotate3d,
  Satellite,
  Zap,
} from 'lucide-react';

export const SIZE_ICON = 16;

export const ROUTES = {
  OVERVIEW: '/',
  CALI_SENSOR: '/cali-sensor',
  MOTOR_TEST: '/motor-test',
  PID_TUNNING: '/pid-tunning',
  INPUT_RC: '/input-rc',
};

export const DRONE_MOTORS: Record<MotorPosition, MotorState> = {
  FL: { id: 'FL', label: 'Front Left', rpm: 0, status: 'idle', temp: 24 },
  FR: { id: 'FR', label: 'Front Right', rpm: 0, status: 'idle', temp: 24 },
  BL: { id: 'BL', label: 'Back Left', rpm: 0, status: 'idle', temp: 24 },
  BR: { id: 'BR', label: 'Back Right', rpm: 0, status: 'idle', temp: 24 },
};

export const SENSOR_CALIBRATION_LIST = [
  {
    id: 'accelerometer',
    name: 'Accelerometer',
    description: 'Xác định trọng lực và độ cân bằng 3 trục.',
    Icon: Layers,
    type: 'IMU',
    unit: 'm/s²',
  },
  {
    id: 'gyroscope',
    name: 'Gyroscope',
    description: 'Đo tốc độ quay và giữ ổn định góc bay.',
    Icon: Rotate3d,
    type: 'IMU',
    unit: 'deg/s',
  },
  {
    id: 'compass',
    name: 'Magnetometer',
    description: 'Hiệu chuẩn la bàn để xác định hướng Bắc từ trường.',
    Icon: Compass,
    type: 'Navigation',
    unit: 'mGauss',
  },
  {
    id: 'barometer',
    name: 'Barometer',
    description: 'Cảm biến áp suất để duy trì độ cao chính xác.',
    Icon: Gauge,
    type: 'Environment',
    unit: 'hPa',
  },
  {
    id: 'gps',
    name: 'GPS / GNSS',
    description: 'Kiểm tra tín hiệu vệ tinh và tọa độ toàn cầu.',
    Icon: Satellite,
    type: 'Navigation',
    unit: 'Sats',
  },
  {
    id: 'power',
    name: 'Power / ESC',
    description: 'Hiệu chuẩn điện áp pin và tốc độ phản hồi motor.',
    Icon: Zap,
    type: 'System',
    unit: 'V / A',
  },
  {
    id: 'level',
    name: 'Level Fix',
    description: 'Thiết lập mặt phẳng ngang tham chiếu (Horizon).',
    Icon: Activity,
    type: 'Calibration',
    unit: 'Offset',
  },
];
