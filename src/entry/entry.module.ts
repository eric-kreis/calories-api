import { Module } from '@nestjs/common';
import { NutrionixAPIServiceModule } from '@services/nutrionix-api/nutrionix-api.service.module';
import { RoleService } from '@services/role.service';
import { EntryRepositoryModule } from '@repositories/entries/entry.repository.module';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';

@Module({
  imports: [NutrionixAPIServiceModule, EntryRepositoryModule],
  controllers: [EntryController],
  providers: [EntryService, RoleService],
})
export class EntryModule {}
