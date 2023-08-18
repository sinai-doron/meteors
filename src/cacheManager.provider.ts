import { Provider } from '@nestjs/common';
import { caching } from 'cache-manager';
import { CACHE_MANAGER } from './cache.constants';

export function createCacheManager(): Provider {
    return {
        provide: CACHE_MANAGER,
        useFactory: async () => {
            const cachingFactory = async ():Promise<Record<string, any>> => {
                return caching('memory', {
                    max: 100,
                    ttl: 1000 * 1000 /*milliseconds*/
                  });
            }

            return cachingFactory();
        }
    }
}