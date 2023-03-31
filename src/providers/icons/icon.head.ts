import { Injectable } from '@nestjs/common';
import { from, Observable, } from 'rxjs';
import { IconService } from './icon.service';

@Injectable()
export class IconsHead {

    constructor(
        private readonly iconService: IconService,
    )  { }


    find(data: {
        page: number,
        pageSize: number,
    }): Observable<any[]> {
        let nbPage: number;
        let nbPageSize: number;

        nbPage = data.page ? +data.page : 0;
        nbPageSize = data.pageSize ? +data.pageSize : 20;

        return this.iconService.readAllIcons(nbPage, nbPageSize);
    }

    search(data: {
        term: string,
        page: number,
        pageSize: number,
    }): Observable<any[]> {
        let nbPage: number;
        let nbPageSize: number;

        nbPage = data.page ? data.page : 0;
        nbPageSize = data.pageSize ? data.pageSize : 20;

        return this.iconService.searchIcon(data.term, nbPage, nbPageSize);
    }

}