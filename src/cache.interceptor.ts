import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, StreamableFile, Logger } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from './cache.constants';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    @Inject()
    protected readonly httpAdapterHost: HttpAdapterHost;
    
    constructor(@Inject(CACHE_MANAGER) protected readonly cacheManager: any){}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.getArgByIndex(0);

        const key = this.httpAdapterHost.httpAdapter.getRequestUrl(request);

        const value = await this.cacheManager.get(key);
        
        if (value !== undefined) {
          Logger.log(`Loading item from cache for ${key}`);
          return of(value);
        }

        return next
            .handle().pipe(
                tap(async response => {
                    if (response instanceof StreamableFile) {
                        return;
                    }
                    
                    try {
                        await this.cacheManager.set(key, response);
                        Logger.log(`Saving item to cache for ${key}`);
                      } catch (err) {
                        Logger.error(
                          `An error has occurred when inserting "key: ${key}", "value: ${response}"`,
                          'CacheInterceptor',
                        );
                        return next.handle();
                      }
                })
            );
    }
}