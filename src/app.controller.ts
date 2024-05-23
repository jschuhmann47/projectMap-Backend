import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Tool } from './herramientas/tools';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('tools')
  getTools() {
    return {
      tool: Object.values(Tool),
    };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
