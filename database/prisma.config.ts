import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

config({ path: new URL('../backend/.env', import.meta.url) });

export default defineConfig({
    schema: './prisma',
    migrations: {
        path: './prisma/migrations',
    },
    datasource: {
        url: env('DATABASE_URL'),
    },
});
