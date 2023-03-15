import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';

export const TaskModelSchema = new mongoose.Schema({
    uuid: String,
    key: String,
    type: String,
    general: new mongoose.Schema(
        {
            displayName: [LangSchema],
            iconName: String,
            profil: String,
        },
        { _id: false, minimize: false }),
    properties: new mongoose.Schema(
        {
            services: [new mongoose.Schema(
                {
                    uuid: String,
                    key: String,
                    type: String,
                    cache: Boolean,
                    execute: String,
                    api: String,
                    route: String,
                    header: [new mongoose.Schema(
                        {
                            key: String,
                            value: String,
                        },
                        { _id: false, minimize: false })],
                    params: [new mongoose.Schema(
                        {
                            key: String,
                            value: mongoose.Schema.Types.Mixed,
                            type: String,
                        },
                        { _id: false, minimize: false })],
                    mappedParams: [new mongoose.Schema(
                        {
                            key: String,
                            value: String,
                        },
                        { _id: false, minimize: false })],
                    body: String,
                    return:
                        new mongoose.Schema(
                            {
                                type: String,
                                multiple: Boolean,
                            },
                            { _id: false, minimize: false }),
                },
                { _id: false, minimize: false })],
            expressions: [new mongoose.Schema(
                {
                    key: String,
                    value: mongoose.Schema.Types.Mixed,
                    type: String,
                },
                { _id: false, minimize: false })],
            transitions: [
                new mongoose.Schema(
                    {
                        uuid: String,
                        key: String,
                        displayName: [LangSchema],
                        task: String,
                        data: [new mongoose.Schema(
                            {
                                uuid: String,
                                key: String,
                                type: String,
                                multiple: Boolean,
                                placeToSave: [String],
                            },
                            { _id: false, minimize: false })],
                        position:
                            new mongoose.Schema(
                                {
                                    x: Number,
                                    y: Number,
                                },
                                { _id: false, minimize: false }),
                    },
                    { _id: false, minimize: false })],
            custom: mongoose.Schema.Types.Mixed,
        },
        { _id: false, minimize: false }),
    position:
        new mongoose.Schema(
            {
                x: Number,
                y: Number,
            },
            { _id: false, minimize: false }),
}, { _id: false, minimize: false });
