import { app } from '../backend/src/server';

export const config = {
    runtime: 'edge',
};

export default (request: Request) => {
    return app.handle(request);
};
