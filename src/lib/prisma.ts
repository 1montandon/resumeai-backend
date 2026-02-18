import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter, log: ["info", "error", "warn"] });

prisma
  .$connect()
  .then(() => console.log("Prisma conectado com sucesso"))
  .catch(() => console.log("Falha ao conectar com prisma "));

export default prisma;
