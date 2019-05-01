import * as fs from 'fs';
import * as express from 'express';
import * as spdy from 'spdy';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';

//
//  node < 8.5
//  node --expose-http2 --experimental-modules ./dana_license/dist/app/cdn/server.h2.js
//
export class CrmApp {

    public app: express.Application = express.default();
    public PRIVATE_KEY = './config/localhost.key';
    public PUBLIC_CERT = './config/localhost.crt';
    public PUBLIC_PATH = './../../../public';
    public PORT = process.env.CRM_PORT || 3001;

    constructor() {
        //
        //
        //  E X P R E S S
        //
        //
        this.express();

        // 
        //
        // H T T P 2
        // 
        // 
        this.H2Server();
    }

    express() {
        //
        // D E P E N D E N C Y
        //
        this.app.use(bodyParser.urlencoded({extended : true}));
        this.app.use(bodyParser.json());
        this.app.use(logger.default('combined'));
        this.app.use(helmet.default());
        this.app.use(cors.default());
        this.app.use(compression.default());
        this.app.use(express.static(path.join(__dirname, this.PUBLIC_PATH), { maxAge: 31557600000 }));

        //
        // R O U T E S
        // C  R  M
        // A N G U L A R
        // F I L E S
        //
        this.app.get('/', (req: express.Request, res: express.Response)=> {
            res.sendFile(path.join(__dirname, this.PUBLIC_PATH + '/index.html'));
        });

        //
        // R O U T E S
        // P I N G
        //
        this.app.get('/ping', function (req: express.Request, res: express.Response) {
          res.json({
              'title': 'pong',
              'protocol': 'HTTP/2',
              'time': new Date(),
            })
        });
    }

    H2Server() {
        // 
        // C R E A T E
        // L E T'S 
        // E N C R Y P T
        // C E R T I F I C A T I O N
        // -----------------------------------------------------
        // 
        // https://letsencrypt.org/docs/certificates-for-localhost/
        // 
        // openssl req -x509 -out localhost.crt -keyout localhost.key \
        //   -newkey rsa:2048 -nodes -sha256 \
        //   -subj '/CN=localhost' -extensions EXT -config <( \
        //    printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
        //
        // -----------------------------------------------------

        // 
        // S P D Y
        // H  T  T  P  2
        // 
        const h2Config = {
            key: fs.readFileSync( this.PRIVATE_KEY ),
            cert: fs.readFileSync( this.PUBLIC_CERT ),
        };

        //
        //
        // L I S T E N
        //
        //
        spdy.createServer(h2Config, this.app).listen( this.PORT );
    }
}
