import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  // Render suele usar /healthz por defecto; exponemos ambos.
  @Get('health')
  check() {
    return { ok: true };
  }

  @Get('healthz')
  checkz() {
    return { ok: true };
  }
}
