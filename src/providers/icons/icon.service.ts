import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Observable, from, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import moment from 'moment';
import { Model } from 'mongoose';
import { FileInfo } from '@algotech/core';
import { FileIcon, IconMetadata, UploadFile } from '../../interfaces';
import { Readable } from 'stream';
import { MongoGridFS } from 'mongo-gridfs';

interface Asset {
    fileId: string;
    name: string;
    tags: string;
}

@Injectable()
export class IconService {

    _iconFS: MongoGridFS;
    get iconFS() {
        if (!this._iconFS && this.connection.db) {
            this._iconFS = new MongoGridFS(this.connection.db, 'icons');
        }
        return this._iconFS;
    }

    constructor(
        @InjectConnection() private readonly connection,
        @InjectModel('Icon') private readonly iconModel: Model<FileIcon>,
    ) { }

    writeMongoIcon(tags: string[], icon: UploadFile): Observable<any> {
        const metadata: IconMetadata = {
            tags,
        };
        const stream = Readable.from(icon.buffer.toString());
        return from(this.iconFS.writeFileStream(
            stream,
            {
                filename: icon.originalname,
                contentType: icon.mimetype,
                metadata,
            },
        )).pipe(
            map((data) => {
                const fileInfo: FileInfo = {
                    fileId: data._id.toString(),
                    uploadDate: moment(data.uploadDate).format(),
                    length: data.length,
                    chunkSize: data.length,
                    filename: data.filename,
                    md5: data.md5,
                    mimetype: data.contentType,
                    metadata: null,
                }
                return {
                    result: 'success',
                    fileInfo,
                };
            }),
        );
    }

    updateIcon(id: string, tags: string[]): Observable<FileIcon> {
        const findOne = from(this.iconModel.findOne({ _id: id }));
        return findOne.pipe(
            mergeMap((icon: FileIcon) => {
                if (!icon) {
                    throwError(() => new Error('No icon to update'));
                } else {
                    const updates: FileIcon = Object.assign({}, icon, { metadata: { tags } });
                    const obsUpdate: Observable<any> =
                        from(this.iconModel.findOneAndUpdate({ _id: id }, { $set: { metadata: { tags } } }, { new: true, runValidators: true }));
                    return obsUpdate.pipe(map(() => updates));
                }
            }),
        );
    }

    readAllIcons(page: number, pageSize: number): Observable<Asset[]> {
        const obsAssets: Observable<Asset[]> = from(this.iconFS.find({})).pipe(
            map((data) => {
                if (Array.isArray(data)) {
                    if (data.length > 0 && data[0]._id && data[0].metadata['tags']) {
                        const assets: Asset[] = data.slice(((page - 1) * pageSize), ((page * pageSize)))
                            .map((d) => {
                                const tabTags = d.metadata['tags'].join();
                                const asset: Asset = {
                                    fileId: d._id.toString(),
                                    name: d.filename,
                                    tags: tabTags,
                                };
                                return asset;
                            });
                        return assets;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }),
        );
        return obsAssets;
    }

    public readIconByName(name: string): Observable<any> {
        return from(this.iconFS.findOne( {filename: name } ));
    }

    public readIconById(id: string): Observable<any> {
        return from(this.iconFS.findById(id));
    }

    public searchIcon(term: string, page: number, pageSize: number): Observable<Asset[]> {
        const nameRegex: string = term + '.*\.[a-z]{3}';
        const tagsRegex: string = term;
        const findIcon: Observable<any> = from(this.iconModel.find(
            { $or: [{ filename: { $regex: nameRegex, $options: 'i' } }, { 'metadata.tags': { $regex: tagsRegex, $options: 'i' } }],
        }));
        return findIcon.pipe(
            map((icons) => {
                if (!icons) {
                    throwError(() => new Error('None icon match the search term'));
                } else {
                    const assets: Asset[] = icons.slice(((page - 1) * pageSize), ((page * pageSize)))
                        .map((icon: FileIcon) => {
                            const tabTags = icon.metadata['tags'].join();
                            let asset: Asset;
                            asset = {
                                fileId: icon._id,
                                name: icon.filename,
                                tags: tabTags,
                            };
                            return asset;
                        });
                    return assets;
                }
            }),
        );
    }
}
