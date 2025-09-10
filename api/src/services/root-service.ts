import { bytesToMB } from '../utils/to-util';
import { HealthCheck, MemoryUsage } from '../types/health-check-type';

// SERVICE 는 [로직] 을 담당합니다.
// 어떠한 데이터를 가져올지 처리하고 그 결과값을 반환합니다.
// CONTROLLER 는 SERVICE 가 주는 결과값을 경우에 맞춰서 반환만 하면 됩니다.

export const getHealthCheck = (): HealthCheck => {
  const status = 'OK';
  const uptime = process.uptime();
  const timestamp = new Date();
  const memoryUsage = process.memoryUsage();

  const memory: MemoryUsage = {
    rss: bytesToMB(memoryUsage.rss),
    heapTotal: bytesToMB(memoryUsage.heapTotal),
    heapUsed: bytesToMB(memoryUsage.heapUsed),
  };

  return {
    status,
    uptime,
    timestamp,
    memory,
  };
};
