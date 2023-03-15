import { Controller, Post, Param, Get, Delete, Patch, Put, Headers, Query, Body, BadRequestException, UnauthorizedException, UploadedFiles, UseInterceptors, Res } from '@nestjs/common';
import { throwError } from 'rxjs';
import * as _ from 'lodash';
import { NatsService, SmartFlowsHead } from '../providers';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { mergeMap } from 'rxjs/operators';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('connectors')
@ApiTags('Connectors')
export class ConnectorsController {

    constructor(
        private readonly smartFlowsHead: SmartFlowsHead,
        private readonly nats: NatsService) { }

    @Post('/:name*')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(AnyFilesInterceptor())
    Post(
        @Headers() headers,
        @Query() queryStrings,
        @Param() urlSegments,
        @Param('name') name,
        @Body() body,
        @UploadedFiles() files,
        @Res() response: Response,
    ) {
        const segments = !urlSegments[0] ? [] : urlSegments[0].replace('/', '').split('/');
        this.nats.sendResponse(this.smartFlowsHead.getSmartFlowLanchOptions('POST', name, body, headers, queryStrings, segments, files).pipe(
            mergeMap((data) => {
                if (!data.canStart) {
                    return throwError(() => new UnauthorizedException())
                }
                if (data.inputErrors.length > 0) {
                    return throwError(() => new BadRequestException(data.inputErrors));
                }
                return this.smartFlowsHead.startSmartFlow({ identity: data.identity, launchOptions: data.launchOptions, httpResponse: true });
            })
        ), response);
    }

    @Put('/:name*')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(AnyFilesInterceptor())
    Put(
        @Headers() headers,
        @Query() queryStrings,
        @Param() urlSegments,
        @Param('name') name,
        @Body() body,
        @UploadedFiles() files,
        @Res() response: Response,
    ) {

        const segments = !urlSegments[0] ? [] : urlSegments[0].replace('/', '').split('/');
        this.nats.sendResponse(this.smartFlowsHead.getSmartFlowLanchOptions('PUT', name, body, headers, queryStrings, segments, files).pipe(
            mergeMap((data) => {
                if (!data.canStart) {
                    throw new UnauthorizedException();
                }
                if (data.inputErrors.length > 0) {
                    throw new BadRequestException(data.inputErrors)
                }
                return this.smartFlowsHead.startSmartFlow({ identity: data.identity, launchOptions: data.launchOptions, httpResponse: true });
            })
        ), response);
    }


    @Get('/:name*')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(AnyFilesInterceptor())
    Get(
        @Headers() headers,
        @Query() queryStrings,
        @Param() urlSegments,
        @Param('name') name,
        @Body() body,
        @UploadedFiles() files,
        @Res() response: Response,
    ) {
        const segments = !urlSegments[0] ? [] : urlSegments[0].replace('/', '').split('/');
        this.nats.sendResponse(this.smartFlowsHead.getSmartFlowLanchOptions('GET', name, body, headers, queryStrings, segments, files).pipe(
            mergeMap((data) => {
                if (!data.canStart) {
                    throw new UnauthorizedException();
                }
                if (data.inputErrors.length > 0) {
                    throw new BadRequestException(data.inputErrors)
                }
                return this.smartFlowsHead.startSmartFlow({ identity: data.identity, launchOptions: data.launchOptions, httpResponse: true });
            })
        ), response);

    }

    @Delete('/:name*')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(AnyFilesInterceptor())
    Delete(
        @Headers() headers,
        @Query() queryStrings,
        @Param() urlSegments,
        @Param('name') name,
        @Body() body,
        @UploadedFiles() files,
        @Res() response: Response,
    ) {

        const segments = !urlSegments[0] ? [] : urlSegments[0].replace('/', '').split('/');
        this.nats.sendResponse(this.smartFlowsHead.getSmartFlowLanchOptions('DELETE', name, body, headers, queryStrings, segments, files).pipe(
            mergeMap((data) => {
                if (!data.canStart) {
                    throw new UnauthorizedException();
                }
                if (data.inputErrors.length > 0) {
                    throw new BadRequestException(data.inputErrors)
                }
                return this.smartFlowsHead.startSmartFlow({ identity: data.identity, launchOptions: data.launchOptions, httpResponse: true });
            })
        ), response);

    }

    @Patch('/:name*')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(AnyFilesInterceptor())
    Patch(
        @Headers() headers,
        @Query() queryStrings,
        @Param() urlSegments,
        @Param('name') name,
        @Body() body,
        @UploadedFiles() files,
        @Res() response: Response,
    ) {

        const segments = !urlSegments[0] ? [] : urlSegments[0].replace('/', '').split('/');
        this.nats.sendResponse(this.smartFlowsHead.getSmartFlowLanchOptions('PATCH', name, body, headers, queryStrings, segments, files).pipe(
            mergeMap((data) => {
                if (!data.canStart) {
                    throw new UnauthorizedException();
                }
                if (data.inputErrors.length > 0) {
                    throw new BadRequestException(data.inputErrors)
                }
                return this.smartFlowsHead.startSmartFlow({ identity: data.identity, launchOptions: data.launchOptions, httpResponse: true });
            })
        ), response);
    }
}
