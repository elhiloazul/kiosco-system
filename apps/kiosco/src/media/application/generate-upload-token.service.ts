import { Injectable, BadRequestException } from '@nestjs/common';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

interface VercelUploadTokenBody {
  type: string;
  payload: {
    pathname: string;
    callbackUrl: string;
    clientPayload?: string;
    multipart?: boolean;
  };
}

@Injectable()
export class GenerateUploadTokenService {
  async execute(tenantId: string, body: VercelUploadTokenBody): Promise<{ clientToken: string }> {
    if (body.type !== 'blob.generate-client-token') {
      throw new BadRequestException('Invalid request type');
    }

    const filename = body.payload.pathname.split('/').pop() ?? body.payload.pathname;
    const pathname = `tenants/${tenantId}/${filename}`;

    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname,
      onUploadCompleted: {
        callbackUrl: body.payload.callbackUrl,
        tokenPayload: body.payload.clientPayload,
      },
      maximumSizeInBytes: 30 * 1024 * 1024,
    });

    return { clientToken };
  }
}
