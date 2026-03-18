// mux-webhook.controller.ts  (new file)
import {
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../tutorials-management/entities/tutorial.entity';
import Mux from '@mux/mux-node';

@Controller('webhooks')
export class MuxWebhookController {
  private mux: Mux;

  constructor(
    @InjectRepository(Unit)
    private unitRepo: Repository<Unit>,
  ) {
    this.mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });
  }

  @Post('mux')
  async handleMuxWebhook(@Body() body: any) {
    const { type, data } = body;

    if (type === 'video.upload.asset_created') {
      // Upload finished → asset is being processed
      const passthrough = JSON.parse(
        data.new_asset_settings?.passthrough ?? '{}',
      );
      if (passthrough.unitId) {
        await this.unitRepo.update(passthrough.unitId, {
          muxAssetId: data.asset_id,
          videoStatus: 'processing',
        });
      }
    }

    if (type === 'video.asset.ready') {
      // Transcoding done → save playbackId
      const passthrough = JSON.parse(data.passthrough ?? '{}');
      const playbackId = data.playback_ids?.[0]?.id;

      if (passthrough.unitId && playbackId) {
        await this.unitRepo.update(passthrough.unitId, {
          muxPlaybackId: playbackId,
          videoStatus: 'ready',
        });
      }
    }

    if (type === 'video.asset.errored') {
      const passthrough = JSON.parse(data.passthrough ?? '{}');
      if (passthrough.unitId) {
        await this.unitRepo.update(passthrough.unitId, {
          videoStatus: 'error',
        });
      }
    }

    return { received: true };
  }
}
