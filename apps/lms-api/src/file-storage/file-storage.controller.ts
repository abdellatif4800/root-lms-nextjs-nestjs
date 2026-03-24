import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { FileStorageService } from './file-storage.service';

@Controller('files')
export class FileStorageController {
  constructor(private fileStorageService: FileStorageService) {}

  // ----------------------- vercel blob -------------------------
  @Post('uploadFileVercelBlob')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileVercel(
    @UploadedFile() file: Express.Multer.File,
    @Body('folderName') folderName: string,
    @Body('fileName') fileName: string,
  ) {
    //vercel blob
    return this.fileStorageService.uploadFileVercelBlob(
      folderName,
      fileName,
      file,
    );
    // --------------------------
    //return this.fileStorageService.uploadFile(file, bucketName, fileName);
  }

  @Get('listFilesVercelblob')
  listFilesVercel(@Query('folder') folder: string) {
    return this.fileStorageService.listFilesVercelblob(folder);
  }

  @Get('getFileVercelBlob/:folderName/:filename')
  getFileVercel(
    @Param('filename') filename: string,
    @Param('folderName') folderName: string,
  ) {
    return this.fileStorageService.getFileVercelblob(folderName, filename);
  }

  @Delete('deleteFileVercelBlob/:folderName/:filename')
  deleteFileVercel(
    @Param('filename') filename: string,
    @Param('folderName') folderName: string,
  ) {
    return this.fileStorageService.getFileVercelblob(folderName, filename);
  }

  // ─── Mux: Next.js calls this before uploading ───
  @Post('mux/upload-url')
  createMuxUploadUrl() {
    return this.fileStorageService.createMuxUploadUrl();
  }

  // ─── Mux: get asset status (poll until ready) ───
  @Get('mux/asset/:assetId')
  getMuxAsset(@Param('assetId') assetId: string) {
    return this.fileStorageService.getMuxAsset(assetId);
  }

  @Get('mux/upload/:uploadId')
  getMuxUpload(@Param('uploadId') uploadId: string) {
    return this.fileStorageService.getMuxUpload(uploadId);
  }

  // ─── Mux: delete video ───
  @Delete('mux/asset/:assetId')
  deleteMuxAsset(@Param('assetId') assetId: string) {
    return this.fileStorageService.deleteMuxAsset(assetId);
  }

  // ─── Mux: signed token for paid tutorials ───
  @Get('mux/token/:playbackId')
  getMuxToken(@Param('playbackId') playbackId: string) {
    return this.fileStorageService.getMuxSignedToken(playbackId);
  }
}
