import { MotorPosition, MotorState } from '@/components/common/Drone/type';

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
