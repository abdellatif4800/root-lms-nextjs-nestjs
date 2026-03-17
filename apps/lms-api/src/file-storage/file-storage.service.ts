import { Injectable } from '@nestjs/common';
import { log } from 'console';
import * as Minio from 'minio';
import { Readable } from 'stream';
import slugify from 'slugify';
import * as vercelBlob from '@vercel/blob';

@Injectable()
export class FileStorageService {
  constructor() {
    //  @InjectMinio() private readonly minioService: Minio.Client
  }

  // vercel blob
  async uploadFileVercelBlob(
    folderName: string,
    fileName: string,
    file: Express.Multer.File,
  ) {
    // sanitize folder
    const cleanFolder = folderName.trim();

    // sanitize file name
    const cleanFileName = fileName.trim();

    const pathAndName = `${cleanFolder}/${cleanFileName}`;

    const blob = await vercelBlob.put(pathAndName, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return blob;
  }

  async getFileVercelblob(folderName: string, fileName: string) {
    // sanitize folder
    const cleanFolder = folderName.trim();

    // sanitize file name
    const cleanFileName = fileName.trim();

    const pathAndName = `${cleanFolder}/${cleanFileName}`;

    const result: any = await vercelBlob.get(pathAndName, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return result;
  }

  async listFilesVercelblob(folderPath: string) {
    const results: any = await vercelBlob.list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      prefix: folderPath,
    });

    return results;
  }

  async deleteFileVercelblob(folderName: string, fileName: string) {
    const cleanFolder = folderName.trim();
    const cleanFileName = fileName.trim();
    const pathAndName = `${cleanFolder}/${cleanFileName}`;

    await vercelBlob.del(pathAndName, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return { deleted: true, path: pathAndName };
  }

  //-------------------------------------------------------------------
  //
  // async createBuckt(bucketName: string) {
  //   await this.minioService.makeBucket(bucketName);
  //   console.log('Bucket created successfully.');
  // }
  //
  // async bucketsList() {
  //   return await this.minioService.listBuckets();
  // }
  //
  // async makeBucketPublic(bucketName: string) {
  //   const policy = {
  //     Version: '2012-10-17',
  //     Statement: [
  //       {
  //         Sid: 'PublicRead',
  //         Effect: 'Allow',
  //         Principal: '*', // "*" means anyone (anonymous)
  //         Action: ['s3:GetObject'], // Allow reading files
  //         Resource: [`arn:aws:s3:::${bucketName}/*`], // All files in this bucket
  //       },
  //     ],
  //   };
  //
  //   await this.minioService.setBucketPolicy(bucketName, JSON.stringify(policy));
  //   const getPolicy = await this.minioService.getBucketPolicy(bucketName);
  //
  //   return getPolicy;
  //   console.log(`Bucket policy file: ${getPolicy}`);
  // }
  //
  // async listObjectsInBucket(bucketName: string): Promise<any[]> {
  //   const data: any[] = [];
  //   const stream = this.minioService.listObjects(bucketName, '', true);
  //   for await (const obj of stream) {
  //     data.push(obj);
  //   }
  //   return data;
  // }
  //
  // async getFile(filename: string, bucketName: string) {
  //   return await this.minioService.presignedGetObject(
  //     bucketName,
  //     filename,
  //     3600,
  //   );
  // }
  //
  // async uploadFile(
  //   file: Express.Multer.File,
  //   bucketName: string,
  //   fileName: string,
  // ) {
  //   // const slugFileName = slugify(fileName);
  //   // const safeFileName = `${slugFileName}.jpg`;
  //
  //   await this.minioService.putObject(
  //     bucketName,
  //     fileName,
  //     file.buffer,
  //     file.size,
  //     function (err, etag) {
  //       return console.log(err, etag);
  //     },
  //   );
  //
  //   return this.getFile(fileName, bucketName);
  // }
}
