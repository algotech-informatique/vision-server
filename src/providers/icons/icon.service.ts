import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Model } from 'mongoose';
import { FileIcon } from '../../interfaces';

interface Asset {
    fileId: string;
    name: string;
    tags: string;
}

@Injectable()
export class IconService {

    constructor(
        @InjectModel('Icons') private readonly iconModel: Model<FileIcon>,
    ) { }

    readAllIcons(page: number, pageSize: number): Observable<Asset[]> {
        return from(this.iconModel.find({}).skip((page * pageSize)).limit(pageSize)).pipe(
            map((data) => {
                return (data as FileIcon[]).map((d: FileIcon) => {
                    return {
                        fileId: d._id.toString(),
                        name: d.filename,
                        tags: d.tags.join(),
                    } as Asset;
                });
            }),
        ) as Observable<Asset[]>;
    }

    public searchIcon(term: string, page: number, pageSize: number): Observable<Asset[]> {
        const tagsRegex: string = term;
        return from(this.iconModel.find( { 'tags': { $regex: tagsRegex, $options: 'i' } })
            .skip((page * pageSize)).limit(pageSize)).pipe(
            map((icons) => {
                return (icons as FileIcon[]).map((icon: FileIcon) => {
                    return {
                        fileId: icon._id,
                        name: icon.filename,
                        tags: icon.tags.join(),
                    } as Asset;
                });
            }),
        ) as Observable<Asset[]>;
    }
}
