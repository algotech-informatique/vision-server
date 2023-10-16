import * as mongoose from 'mongoose';
import { SnPageEventPipeSmartflowResultSchema } from './smart-nodes-page-event-pipe-smartflow-result.schema';

export const SnPageEventPipeSchema = new mongoose.Schema(
    {
        id: String,
        key: String,
        type: String,
        action: String,
        inputs: [new mongoose.Schema(
                {
                    key: String,
                    value: mongoose.Schema.Types.Mixed,
                },
                { _id: false, minimize: false },
            ),
        ],
        custom: mongoose.Schema.Types.Mixed,
        smartflowResult: SnPageEventPipeSmartflowResultSchema,
    },
    { _id: false, minimize: false },
);
