import { Controller, Post, Query, Request, UseGuards } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { DocumentService } from '../services/document.service';
import { PathResolver } from 'utils/PathResolver/pathResolver';
import { DocumentTypeEnum } from '../enums/documentType.enum';

@ApiTags('Document')
@Controller({ path: 'document', version: '1' })
export class DocumentController {
  constructor(private readonly DocumentService: DocumentService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload a file' })
  @ApiQuery({
    name: 'type',
    enum: DocumentTypeEnum,
    required: true,
    description: 'Type of file to upload (feature, step definition, or js)',
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Error uploading file.' })
  async upload(@Request() req, @Query('type') type: DocumentTypeEnum) {
    try {
      // Ensure `@fastify/multipart` is properly configured
      const data = await req.file();

      // File details
      const fileName = data.filename;

      // Determine the target directory based on the `type` query parameter
      let scriptsDir = PathResolver.Instance.resolvePath('scripts');
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      if (fileExtension === 'feature') {
        scriptsDir = PathResolver.Instance.resolvePath('scripts/features');
      } else if (fileExtension === 'js') {
        scriptsDir = PathResolver.Instance.resolvePath(
          'scripts/step-definitions',
        );
      }
      // Default for js and any other type
      const filePath = `${scriptsDir}/${fileName}`;

      // Create the target directory if it doesn't exist
      if (!fs.existsSync(scriptsDir)) {
        fs.mkdirSync(scriptsDir, { recursive: true });
      }

      // Save the file using a write stream
      const writeStream = fs.createWriteStream(filePath);
      data.file.pipe(writeStream);

      // Wait for the file to finish writing
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const document = {} as any;
      document.name = fileName;
      document.path = filePath;
      document.doc_type = data.mimetype;
      document.uploaded_by = req.user.userId;

      // Save document details to the database
      const savedDocument = await this.DocumentService.create(document);

      return { message: 'File uploaded successfully', data: savedDocument };
    } catch (error) {
      console.log(error);
      return { message: 'Error uploading file', error };
    }
  }
}
