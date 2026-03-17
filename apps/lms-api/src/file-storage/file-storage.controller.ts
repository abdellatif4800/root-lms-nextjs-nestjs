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
import { log } from 'console';

@Controller('files')
export class FileStorageController {
  constructor(private fileStorageService: FileStorageService) { }

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
  //
  // //---------------Buckets-----------------------
  // @Post('createBuckt')
  // async createBucket(@Body('bucketName') bucketName: string) {
  //   return this.fileStorageService.createBuckt(bucketName);
  // }
  //
  // @Get('listBuckets')
  // bucketsList() {
  //   log(123);
  //   return this.fileStorageService.bucketsList();
  // }
  // @Post('makeBucketPublic/:bucketName')
  // makeBucketPublic(@Param('bucketName') bucketName: string) {
  //   return this.fileStorageService.makeBucketPublic(bucketName);
  // }
  //
  // @Post('uploadFile')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body('bucketName') bucketName: string,
  //   @Body('fileName') fileName: string,
  // ) {
  //   return this.fileStorageService.uploadFile(file, bucketName, fileName);
  // }
  //
  // @Get('listFileInBucket/:bucketName')
  // listFileInBucjet(@Param('bucketName') bucketName: string) {
  //   return this.fileStorageService.listObjectsInBucket(bucketName);
  // }
  //
  // //--------------------get file----------------
  // @Get('fileUrl/:bucketName/:filename')
  // getFile(
  //   @Param('filename') filename: string,
  //   @Param('bucketName') bucketName: string,
  // ) {
  //   return this.fileStorageService.getFile(filename, bucketName);
  // }
}
