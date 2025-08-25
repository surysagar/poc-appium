import { Module } from '@nestjs/common';
import { DocumentController } from './controllers/document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DocumentsSchema,
  CollectionName as DocumentsCollectionName,
} from './schemas/document.schema';
import { DocumentService } from './services/document.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentsCollectionName, schema: DocumentsSchema },
    ]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
