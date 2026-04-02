import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from './api-response.model';

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && isApiResponse(event.body)) {
        return event.clone({ body: event.body.payload });
      }
      return event;
    })
  );
};

function isApiResponse(body: unknown): body is ApiResponse<unknown> {
  return (
    typeof body === 'object' &&
    body !== null &&
    'success' in body &&
    'payload' in body
  );
}
