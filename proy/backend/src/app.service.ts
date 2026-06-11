import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'ðŸ\u008c„ Sistema de Registro Turístico de Bolivia - Backend API v1.0.0';
  }
}
