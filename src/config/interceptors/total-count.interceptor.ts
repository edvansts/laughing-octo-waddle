import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isNumber } from 'class-validator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TotalCountInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        if (data && isNumber(data.totalCount)) {
          response.header('X-Total-Count', data.totalCount);
          return data.data;
        }

        return data;
      }),
    );
  }
}
