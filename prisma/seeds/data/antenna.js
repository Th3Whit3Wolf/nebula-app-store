
const antennaData = [
  {
    serverID: 1,
    teamID: 1,
    unit: 1,
    operational: true,
    targetID: 1,
    locked: true,
    band: "C",
    offset: 400,
    hpa: false,
    loopback: true,
  },
  {
    serverID: 1,
    teamID: 1,
    unit: 2,
    operational: true,
    targetID: 4,
    locked: true,
    band: "Ku",
    offset: 400,
    hpa: false,
    loopback: true,
  },
  {
    serverID: 1,
    teamID: 2,
    unit: 1,
    operational: true,
    targetID: 1,
    locked: true,
    band: "C",
    offset: 400,
    hpa: false,
    loopback: true,
  },
  {
    serverID: 1,
    teamID: 2,
    unit: 2,
    operational: true,
    targetID: 1,
    locked: true,
    band: "C",
    offset: 400,
    hpa: false,
    loopback: true,
  },
  {
    serverID: 1,
    teamID: 3,
    unit: 1,
    operational: true,
    targetID: 1,
    locked: true,
    band: "C",
    offset: 400,
    hpa: false,
    loopback: true,
  },
  {
    serverID: 1,
    teamID: 3,
    unit: 2,
    operational: true,
    targetID: 1,
    locked: true,
    band: "C",
    offset: 400,
    hpa: false,
    loopback: true,
  },
  {
    serverID: 1,
    teamID: 4,
    unit: 1,
    operational: true,
    targetID: 1,
    locked: true,
    band: "C",
    offset: 400,
    hpa: false,
    loopback: true,
  },
  {
    serverID: 1,
    teamID: 4,
    unit: 2,
    operational: true,
    targetID: 1,
    locked: true,
    band: "C",
    offset: 400,
    hpa: false,
    loopback: true,
  },
];

const seed = async (prisma) => {
  console.log("SEEDING:ANTENNA initialized...");

  const current = await prisma.antenna.findMany({  });
  if (current.length !== antennaData.length) {
    await prisma.antenna.deleteMany({})
    await prisma.antenna.createMany({data: antennaData});
  }
  
  console.log("SEEDING:ANTENNA completed...");
};

export default seed;
