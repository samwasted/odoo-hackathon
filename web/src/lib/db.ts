import {PrismaClient} from '../generated/prisma';
declare global{
    var prisma: PrismaClient | undefined;
}
export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') {
    globalThis.prisma = db;
}
//to prevent reinitialization of the Prisma Client in development mode
//this is because in development mode, the server restarts on every file change