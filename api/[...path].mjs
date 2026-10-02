import {createHandler} from '../backend/server.mjs';

const handle = createHandler({staticFiles: false});

export default handle;
