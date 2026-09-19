import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {LoggerModule} from ".././infrastructure";
import {LoggingInterceptor, RequestIdInterceptor} from "./interceptors";

@Module({
    imports: [LoggerModule],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
        { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    ],
})
export class SharedModule {}
