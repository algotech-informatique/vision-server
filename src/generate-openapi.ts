import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { dump } from 'js-yaml'
import { writeFileSync } from 'fs';

const targetOpenapiFile = 'documentation/openapi.yml';
const packageJson = require('../package.json');

async function generateOpenApiDoc() {
    try {
        console.log('Generating OpenAPI documentation file')

        const app = await NestFactory.create(AppModule, { logger: ['verbose']});

        const swaggerConfig = new DocumentBuilder() 
            .setTitle(packageJson.name)
            .setDescription(packageJson.description)
            .setVersion(packageJson.version)
            .build();

        const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

        const ymlString = dump(swaggerDocument);
        writeFileSync(targetOpenapiFile, ymlString, 'utf8');
        
        
        console.log(`Export finished to ${targetOpenapiFile}`);

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(-1);
    }
}
generateOpenApiDoc();
