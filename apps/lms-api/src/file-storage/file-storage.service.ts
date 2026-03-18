import { Injectable } from '@nestjs/common';
import { log } from 'console';
import * as Minio from 'minio';
import { Readable } from 'stream';
import slugify from 'slugify';
import * as vercelBlob from '@vercel/blob';
import Mux from '@mux/mux-node';

@Injectable()
export class FileStorageService {
  private mux: Mux;

  constructor() {
    this.mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
      // ✅ signing keys go here, not in the method
      jwtSigningKey: process.env.MUX_SIGNING_KEY_ID,
      jwtPrivateKey: process.env.MUX_SIGNING_PRIVATE_KEY,
    });
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

  // ─── Mux: create a direct upload URL ───
  async createMuxUploadUrl(tutorialId: string, unitId: string) {
    const upload = await this.mux.video.uploads.create({
      cors_origin: process.env.FRONTEND_URL ?? '*',
      new_asset_settings: {
        playback_policy: ['public'], // or 'signed' for paid courses
        passthrough: JSON.stringify({ tutorialId, unitId }), // track which unit this belongs to
      },
    });

    return {
      uploadId: upload.id,
      uploadUrl: upload.url,
    };
  }

  // ─── Mux: get upload status (returns asset_id once upload is processed) ───
  async getMuxUpload(uploadId: string) {
    return this.mux.video.uploads.retrieve(uploadId);
  }

  // ─── Mux: get asset status ───
  async getMuxAsset(assetId: string) {
    return this.mux.video.assets.retrieve(assetId);
  }

  // ─── Mux: delete asset ───
  async deleteMuxAsset(assetId: string) {
    await this.mux.video.assets.delete(assetId);
    return { deleted: true, assetId };
  }

  // ─── Mux: generate signed playback token (for isPaid tutorials) ───
  async getMuxSignedToken(playbackId: string): Promise<{ token: string }> {
    const token = await this.mux.jwt.signPlaybackId(playbackId, {
      expiration: '12h',
      type: 'video',
    });
    return { token };
  }
}
