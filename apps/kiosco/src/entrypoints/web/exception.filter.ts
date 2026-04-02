import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof UnauthorizedException) {
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
      return response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: HttpStatus.BAD_REQUEST,
          message: JSON.stringify(exception.flatten().fieldErrors),
          userMessage: 'Los datos enviados no son válidos. Revisa los campos e intenta de nuevo.',
        },
      });
    }

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        success: false,
        error: {
          code: exception.getStatus(),
          message: exception.message,
          userMessage: 'Ocurrió un error al procesar tu solicitud.',
        },
      });
    }

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
