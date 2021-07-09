import { config } from "../../config";
import { version, description } from '../../../package.json';

export const appVersion = () => {

    return (`<!DOCTYPE html>
    <html lang="pt-br">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <title>${config.appName} v${version}</title>
    </head>
    
    <body>
        <div class="container mt-5 alert alert-dark" role="alert">
            <h4 class="alert-heading">${config.appName}</h4>
            <p>${description}</p>
            <hr>
            <p class="mb-0">Versão atual: ${version}</p>
          </div>
    </body>
    
    </html>
   `);
}