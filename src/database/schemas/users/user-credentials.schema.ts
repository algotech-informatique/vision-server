import * as mongoose from 'mongoose';

export const CredentialsSchema = new mongoose.Schema({
    login: String,
    password: String,
    bcryptPassword: String,
    refreshToken: String,
    credentialsType: String,
    credentialsToken: String,
    expirationDate: Number,
    accessToken: String,
    idToken: String,
    creationDate: Date,
    passwordLastUpdate: Number,
    history: [String],
    counter: Number,
    blockedAccount: Boolean,
}, { _id: false, minimize: false });
