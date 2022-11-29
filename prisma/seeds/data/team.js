const teamData = [
  { name: "Persephone" },
  { name: "Sisyphus" },
  { name: "Tartarus" },
  { name: "Zagreus" },
];

const seed = async (prisma) => {
  console.log("SEEDING::TEAM initialized...");

  const current = await prisma.team.findMany({  });
  if (current.length !== teamData.length) {
    await prisma.team.deleteMany({})
    await prisma.team.createMany({data: teamData});
  }

  console.log("SEEDING::TEAM completed...");
};

export default seed;
