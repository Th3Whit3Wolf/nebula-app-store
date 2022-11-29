-- CreateEnum
CREATE TYPE "bands" AS ENUM ('TLF', 'ELF', 'SLF', 'ULF', 'VLF', 'LF', 'MF', 'HF', 'VHF', 'UHF', 'SHF', 'EHF', 'THF', 'L', 'S', 'C', 'X', 'Ku', 'K', 'Ka', 'V', 'W', 'mm');

-- CreateEnum
CREATE TYPE "modulations" AS ENUM ('8QAM', '16QAM', 'BPSK', 'QPSK');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "targets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "offset" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antennas" (
    "id" SERIAL NOT NULL,
    "unit" INTEGER NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "band" "bands" NOT NULL,
    "offset" DOUBLE PRECISION NOT NULL,
    "hpa" BOOLEAN NOT NULL DEFAULT false,
    "loopback" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_id" INTEGER,
    "team_id" INTEGER,
    "target_id" INTEGER,

    CONSTRAINT "antennas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions" (
    "id" SERIAL NOT NULL,
    "unit" INTEGER NOT NULL,
    "modem_number" INTEGER NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT false,
    "frequency" DOUBLE PRECISION NOT NULL,
    "bandwidth" DOUBLE PRECISION NOT NULL,
    "power" DOUBLE PRECISION NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_id" INTEGER,
    "team_id" INTEGER,
    "antenna_id" INTEGER,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_id" INTEGER,
    "team_id" INTEGER,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receivers" (
    "id" SERIAL NOT NULL,
    "unit" INTEGER NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT false,
    "frequency" DOUBLE PRECISION NOT NULL,
    "bandwidth" DOUBLE PRECISION NOT NULL,
    "number" INTEGER NOT NULL,
    "modulation" "modulations" NOT NULL,
    "fec" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_id" INTEGER,
    "team_id" INTEGER,
    "antenna_id" INTEGER,

    CONSTRAINT "receivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transmitters" (
    "id" SERIAL NOT NULL,
    "unit" INTEGER NOT NULL,
    "modem_number" INTEGER NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT false,
    "frequency" DOUBLE PRECISION NOT NULL,
    "bandwidth" DOUBLE PRECISION NOT NULL,
    "power" DOUBLE PRECISION NOT NULL,
    "transmitting" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_id" INTEGER,
    "team_id" INTEGER,
    "antenna_id" INTEGER,

    CONSTRAINT "transmitters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spectrum_analyzers" (
    "id" SERIAL NOT NULL,
    "unit" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT false,
    "frequency" DOUBLE PRECISION NOT NULL,
    "span" DOUBLE PRECISION NOT NULL,
    "marker1freq" DOUBLE PRECISION NOT NULL,
    "marker2freq" DOUBLE PRECISION NOT NULL,
    "trace" BOOLEAN NOT NULL DEFAULT false,
    "rf" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_id" INTEGER,
    "team_id" INTEGER,
    "antenna_id" INTEGER,

    CONSTRAINT "spectrum_analyzers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signals" (
    "id" SERIAL NOT NULL,
    "frequency" DOUBLE PRECISION NOT NULL,
    "power" DOUBLE PRECISION NOT NULL,
    "bandwidth" DOUBLE PRECISION NOT NULL,
    "modulation" "modulations" NOT NULL,
    "fec" TEXT NOT NULL,
    "feed" TEXT NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_id" INTEGER,
    "target_id" INTEGER,

    CONSTRAINT "signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "injects" (
    "id" SERIAL NOT NULL,
    "unit" INTEGER NOT NULL,
    "equipment" TEXT NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT false,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_id" INTEGER,

    CONSTRAINT "injects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saves" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saves_signals" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "save_id" INTEGER,
    "signal_id" INTEGER,

    CONSTRAINT "saves_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saves_injects" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "save_id" INTEGER,
    "inject_id" INTEGER,

    CONSTRAINT "saves_injects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "antennas" ADD CONSTRAINT "antennas_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antennas" ADD CONSTRAINT "antennas_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antennas" ADD CONSTRAINT "antennas_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "targets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_antenna_id_fkey" FOREIGN KEY ("antenna_id") REFERENCES "antennas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivers" ADD CONSTRAINT "receivers_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivers" ADD CONSTRAINT "receivers_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivers" ADD CONSTRAINT "receivers_antenna_id_fkey" FOREIGN KEY ("antenna_id") REFERENCES "antennas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transmitters" ADD CONSTRAINT "transmitters_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transmitters" ADD CONSTRAINT "transmitters_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transmitters" ADD CONSTRAINT "transmitters_antenna_id_fkey" FOREIGN KEY ("antenna_id") REFERENCES "antennas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spectrum_analyzers" ADD CONSTRAINT "spectrum_analyzers_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spectrum_analyzers" ADD CONSTRAINT "spectrum_analyzers_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spectrum_analyzers" ADD CONSTRAINT "spectrum_analyzers_antenna_id_fkey" FOREIGN KEY ("antenna_id") REFERENCES "antennas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signals" ADD CONSTRAINT "signals_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signals" ADD CONSTRAINT "signals_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "targets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "injects" ADD CONSTRAINT "injects_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saves_signals" ADD CONSTRAINT "saves_signals_save_id_fkey" FOREIGN KEY ("save_id") REFERENCES "saves"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saves_signals" ADD CONSTRAINT "saves_signals_signal_id_fkey" FOREIGN KEY ("signal_id") REFERENCES "signals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saves_injects" ADD CONSTRAINT "saves_injects_save_id_fkey" FOREIGN KEY ("save_id") REFERENCES "saves"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saves_injects" ADD CONSTRAINT "saves_injects_inject_id_fkey" FOREIGN KEY ("inject_id") REFERENCES "injects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
