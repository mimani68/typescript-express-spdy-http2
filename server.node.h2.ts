import * as http2 from 'http2';
import * as fs from 'fs';

//
//  node < 8.5
//  node --expose-http2 --experimental-modules ./dana_license/dist/app/cdn/server.h2.js
//

export class H2Class {
    constructor() {

        const PRIVATE_KEY = './dist/app/cdn/localhost.key';
        const PUBLIC_CERT = './dist/app/cdn/localhost.crt';

        let PORT = process.env.CRM_PORT || 3001;
        
        // 
        // C R E A T E
        // L E T'S 
        // E N C R Y P T
        // C E R T I F I C A T I O N
        // 
        // https://letsencrypt.org/docs/certificates-for-localhost/
        // 
        // openssl req -x509 -out localhost.crt -keyout localhost.key \
        //   -newkey rsa:2048 -nodes -sha256 \
        //   -subj '/CN=localhost' -extensions EXT -config <( \
        //    printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
        //


        // 
        // 
        // N O D E J S . O R G
        // S A M P L E
        // 
        // 
        const h2Config: http2.SecureServerOptions = {
            key: fs.readFileSync(PRIVATE_KEY),
            cert: fs.readFileSync(PUBLIC_CERT),
            maxDeflateDynamicTableSize: 5
        };
        const serverH2 = http2.createSecureServer(h2Config);
        serverH2.on('error', (err: any) => console.error('[CDN]', err));
        serverH2.on('stream', (stream: http2.ServerHttp2Stream, headers: http2.IncomingHttpHeaders) => {

            // 
            // STREAM is a Duplex
            // 
            // console.log('[CDN] cdn based on http2 is running');
            // stream.respond({
            //     'content-type': 'application/json',
            //     ':status': 200
            // });
            
            //
            //
            // H E A D E R S
            // 
            //
            // console.log('[CDN] header...', headers);
            // console.log('[CDN] header...', headers[':method']);   // GET
            // console.log('[CDN] header...', headers[':path']);     // http://localhost:3001
            // console.log('[CDN] header...', headers[':autority']); //
            // console.log('[CDN] header...', headers[':scheme']);   // HTTPS
            // console.log('[CDN] stream...', stream);

            // 
            // S I M P L E
            // R O U T E R
            //
            //
            // R O U T E R
            // P I N G
            // 
            if ( headers[':path'] && headers[':path'].search(/ping/i) === 1 ) {
                stream.respond({
                    'content-type': 'application/json',
                    ':status': 200
                });
                stream.end(JSON.stringify({
                    title: 'PONG',
                    time: new Date().toISOString()                   
                }));
            
            //
            // R O U T E R
            // I N D E X
            // 
            } else if ( headers[':path'] && headers[':path'].search(/index/i) === 1 ) {
                stream.respond({
                    'content-type': 'application/json',
                    ':status': 200
                });
                stream.end(JSON.stringify({
                    title: 'welcome to front end'
                }));

            //
            // S T A T I C
            // F I L E S
            // 
            } else {

                // FIXME: need serve static content

                const PUBLIC_PATH = './app/cdn/public/index.html';

                // 
                // D E B U G
                // D I R E C T O R Y
                // 
                // fs.readdir('./app/cdn/public', function(err, items) {
                //     console.log(items);
                // });

                //
                // 01
                //
                // stream.setDefaultEncoding('utf-8');
                // const fd = fs.openSync(PUBLIC_PATH, 'r');
                // const stat = fs.fstatSync(fd);
                // const headers = {
                //     'content-length': stat.size,
                //     'last-modified': stat.mtime.toUTCString(),
                //     'Content-Type' : 'text/html; charset=utf-8'
                //   };
                // stream.respondWithFD( fd, headers);


                //
                // 02
                //
                stream.setDefaultEncoding('utf-8');
                const headersFile = {
                    'Content-Type' : 'text/html; charset=utf-8'
                };
                stream.respondWithFile( PUBLIC_PATH, headersFile );

            }

        });


        //
        // 
        // L I S T E N 
        // H T T P 2
        // S E R V E R
        // 
        // 
        serverH2.listen(PORT);

    }
}
