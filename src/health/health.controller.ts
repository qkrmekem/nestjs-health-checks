import { Controller, Get } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {

    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: TypeOrmHealthIndicator,
        private disk: DiskHealthIndicator,
        private memory: MemoryHealthIndicator,
    ){}

    @Get()
    @HealthCheck()
    check(){
        return this.health.check([
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
            () => this.http.responseCheck(
                'my-external-service',
                'https://my-external-service.com',
                (res) => res.status === 204,
            )
        ])
    }

    @Get('db')
    @HealthCheck()
    dbCheck(){
        return this.health.check([
            () => this.db.pingCheck('database'),
        ])
    }


    @Get('disk')
    @HealthCheck()
    diskCheck(){
        return this.health.check([
            () => this.disk.checkStorage('storage_percent', { path: 'C:\\', thresholdPercent: 0.5, }),
            () => this.disk.checkStorage('storage', { path: 'C:\\', threshold: 250 * 1024 * 1024 * 1024, }),
            () => this.disk.checkStorage('storage_error', { path: 'C:\\', threshold: 100 * 1024 * 1024 * 1025, })
        ])
    }

    @Get('memory')
    @HealthCheck()
    memoryCheck(){
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.memory.checkHeap('memory_heap_error', 150),
            () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss_error', 150),
        ])
    }

}
