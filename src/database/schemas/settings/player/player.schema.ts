import * as mongoose from 'mongoose';


export const PlayerManifestIconSchema = new mongoose.Schema({
    src: String,
    sizes: String,
    type: String,
    purpose: String,
}, {_id: false, minimize: false});

export const PlayerManifestRelatedAppsSchema = new mongoose.Schema({
    platform: String,
    url: String,
}, {_id: false, minimize: false});

export const PlayerSchema = new mongoose.Schema({
    name: String,
    short_name: String,
    gcm_sender_id: String,
    theme_color: String,
    background_color: String,
    orientation: {
        type: String,
        enum: ['landscape', 'portrait', 'landscape-primary', 'portrait-primary']
    },
    display: String,
    scope: String,
    start_url: String,
    id: String,
    related_applications: [PlayerManifestRelatedAppsSchema],
    icons: [PlayerManifestIconSchema],

}, {_id: false, minimize: false});
