import { Module } from "@nestjs/common";
import { createCacheManager } from "./cacheManager.provider";
import { CACHE_MANAGER } from "./cache.constants";

@Module({
    providers: [createCacheManager()],
    exports: [CACHE_MANAGER],
  })
  export class CacheModule {
    
  }