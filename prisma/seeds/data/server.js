const serverData = [
  {
    name: "533TRS",
  },
];

const seed = async (prisma) => {
  console.log("SEEDING::SERVER initialized...");

  const current = await prisma.server.findMany({  });
  if (current.length !== serverData.length) {
    await prisma.server.deleteMany({})
    await prisma.server.createMany({data: serverData});
  }

  console.log("SEEDING::SERVER completed...");
};

export default seed;
