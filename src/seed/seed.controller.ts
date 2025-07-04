import { Get, Controller } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  seedExecute() {
    return this.seedService.executeSeed();
  }
}
