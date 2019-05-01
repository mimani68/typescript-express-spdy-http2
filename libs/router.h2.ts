export interface IRouter {
    query?: any,
    param?: any,
    subdir?: string[]
}

export function router( urlPath: string ) {
    let temp;
    let query: any;
    if ( urlPath ) {
        //
        // extract query
        //
        if ( urlPath.search('?') > -1 ) {
            let temp: any = urlPath.split('?')[1];
            if ( temp.search('&') > -1 ) {
                temp = temp.split('&');
                for (let index = 0; index < temp.length; index++) {
                    const key: string = (temp.split('&')[index]).split('=')[0];
                    const value: string = (temp.split('&')[index]).split('=')[1];
                    query[key] = value;
                }
            } else {
                const key: string = (temp.split('&')[0]).split('=')[0];
                const value: string = (temp.split('&')[0]).split('=')[1];
                query[key] = value;
            }
        }

        temp = urlPath.split('/');
        //
        // extract WihtSpace
        //
        if ( !temp.find(value=>value!=='') ) {
            temp = temp.filter(value => value !== '' );
        }
        //
        // extract Null
        //
        if ( !temp.find(value=>value!==null) ) {
            temp = temp.filter(value => value !== null );
        }

        const result: IRouter = {
            query: query,
        }

        return result;
    } else {
        return null;
    }
}