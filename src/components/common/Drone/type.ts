export type MotorPosition = 'FL' | 'FR' | 'BL' | 'BR';

/**
 *
 */
export interface MotorState {
  id: MotorPosition;
  label: string;
  rpm: number;
  status: 'idle' | 'testing' | 'error';
  temp: number;
}

/**
 * interface IMUData
 */
export interface IMUData {
  pitch: number;
  roll: number;
  yaw: number;
  altitude: number;
  throttle: number;
}
