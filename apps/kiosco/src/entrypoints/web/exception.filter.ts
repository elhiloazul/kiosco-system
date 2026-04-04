import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, UnauthorizedException, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { ZodError } from 'zod';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const meta = `${request.method} ${request.url}`;

    if (exception instanceof UnauthorizedException) {
      this.logger.warn(`[401] ${meta}`);
      return response.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: {
          code: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
          userMessage: 'No tienes permiso para acceder a este recurso.',
        },
      });
    }

    if (exception instanceof ZodError) {
      const fields = JSON.stringify(exception.flatten().fieldErrors);
      this.logger.warn(`[400] ${meta} — ZodError: ${fields}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: HttpStatus.BAD_REQUEST,
          message: fields,
          userMessage: 'Los datos enviados no son válidos. Revisa los campos e intenta de nuevo.',
        },
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      this.logger.warn(`[${status}] ${meta} — ${exception.message}`);
      return response.status(status).json({
        success: false,
        error: {
          code: status,
          message: exception.message,
          userMessage: 'Ocurrió un error al procesar tu solicitud.',
        },
      });
    }

    this.logger.error(`[500] ${meta}`, exception instanceof Error ? exception.stack : String(exception));
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        userMessage: 'Ocurrió un error inesperado. Por favor intenta más tarde.',
      },
    });
  }
}
