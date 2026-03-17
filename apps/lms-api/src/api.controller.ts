import 'dotenv';
import { Controller, Get, Post, Res } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}
}
