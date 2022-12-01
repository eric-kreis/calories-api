import { Module } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import { EntryRepository } from './entry.repository';

@Module({
  providers: [EntryRepository, PrismaService],
  exports: [EntryRepository],
})
export class EntryRepositoryModule {}
