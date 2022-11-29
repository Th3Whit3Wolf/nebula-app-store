const targetData = [
  { name: "ARKE 3G", offset: 400 },
  { name: "AURORA 2B", offset: 450 },
  { name: "AUXO STAR", offset: 420 },
  { name: "ENYO", offset: 300 },
  { name: "HASHCOMM 7", offset: 365 },
  { name: "HUF UHF FO", offset: 210 },
  { name: "MERCURY PAWN", offset: 150 },
  { name: "NYXSAT", offset: 250 },
  { name: "RASCAL", offset: 120 },
  { name: "WILL 1-AM", offset: 345 },
];

const seed = async (prisma) => {
  console.log("SEEDING::TARGET initialized...");
  
  const current = await prisma.target.findMany({  });
  if (current.length !== targetData.length) {
    await prisma.target.deleteMany({})
    await prisma.target.createMany({data: targetData});
  }

  console.log("SEEDING::TARGET completed...");
};

export default seed;
