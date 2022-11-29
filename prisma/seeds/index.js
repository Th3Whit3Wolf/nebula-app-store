import { PrismaClient } from "@prisma/client";
import { antenna, receiver, server, signal, spectrumAnalyzer, target, team, transmitter } from "./data/index.js";

const prisma = new PrismaClient();

const main = async () => {
  console.log("Start seeding ...");

  await server(prisma);
  await target(prisma);
  await team(prisma);
  await antenna(prisma);
  await receiver(prisma);
  await signal(prisma);
  await spectrumAnalyzer(prisma);
  await transmitter(prisma);

  console.log("Seeding finished.");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
