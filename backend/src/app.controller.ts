/* eslint-disable import/order */
import { Controller, Get } from '@nestjs/common';
import 'reflect-metadata';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
