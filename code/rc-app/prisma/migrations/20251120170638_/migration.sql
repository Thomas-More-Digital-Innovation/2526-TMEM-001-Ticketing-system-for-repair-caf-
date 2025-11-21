-- CreateTable
CREATE TABLE "GebruikerType" (
    "gebruikerTypeId" SERIAL NOT NULL,
    "typeNaam" TEXT NOT NULL,

    CONSTRAINT "GebruikerType_pkey" PRIMARY KEY ("gebruikerTypeId")
);

-- CreateTable
CREATE TABLE "Gebruiker" (
    "gebruikerId" SERIAL NOT NULL,
    "gebruikerNaam" TEXT NOT NULL,
    "naam" TEXT NOT NULL,
    "wachtwoord" TEXT NOT NULL,
    "gebruikerTypeId" INTEGER NOT NULL,

    CONSTRAINT "Gebruiker_pkey" PRIMARY KEY ("gebruikerId")
);

-- CreateTable
CREATE TABLE "Sessie" (
    "sessieId" SERIAL NOT NULL,
    "startTijd" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vervalTijd" TIMESTAMP(3) NOT NULL,
    "gebruikerId" INTEGER NOT NULL,

    CONSTRAINT "Sessie_pkey" PRIMARY KEY ("sessieId")
);

-- CreateTable
CREATE TABLE "QRLogin" (
    "qrLoginId" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "vervalTijd" TIMESTAMP(3) NOT NULL,
    "isGebruiktTijd" TIMESTAMP(3),
    "gebruikerId" INTEGER NOT NULL,

    CONSTRAINT "QRLogin_pkey" PRIMARY KEY ("qrLoginId")
);

-- CreateTable
CREATE TABLE "Cafe" (
    "cafeId" SERIAL NOT NULL,
    "cafePatroon" TEXT NOT NULL,
    "naam" TEXT NOT NULL,
    "locatie" TEXT NOT NULL,

    CONSTRAINT "Cafe_pkey" PRIMARY KEY ("cafeId")
);

-- CreateTable
CREATE TABLE "Cafedag" (
    "cafedagId" SERIAL NOT NULL,
    "cafeId" INTEGER NOT NULL,
    "startDatum" TIMESTAMP(3) NOT NULL,
    "eindDatum" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cafedag_pkey" PRIMARY KEY ("cafedagId")
);

-- CreateTable
CREATE TABLE "CafeGebruiker" (
    "cafeGebruikerId" SERIAL NOT NULL,
    "gebruikerId" INTEGER NOT NULL,
    "cafeId" INTEGER NOT NULL,

    CONSTRAINT "CafeGebruiker_pkey" PRIMARY KEY ("cafeGebruikerId")
);

-- CreateTable
CREATE TABLE "KlantType" (
    "klantTypeId" SERIAL NOT NULL,
    "naam" TEXT NOT NULL,

    CONSTRAINT "KlantType_pkey" PRIMARY KEY ("klantTypeId")
);

-- CreateTable
CREATE TABLE "Klant" (
    "klantId" SERIAL NOT NULL,
    "klantTypeId" INTEGER NOT NULL,
    "klantnaam" TEXT NOT NULL,
    "telNummer" TEXT,

    CONSTRAINT "Klant_pkey" PRIMARY KEY ("klantId")
);

-- CreateTable
CREATE TABLE "Cafedagvoorwerp" (
    "cafedagVoorwerpId" SERIAL NOT NULL,
    "cafedagId" INTEGER NOT NULL,
    "voorwerpId" INTEGER NOT NULL,

    CONSTRAINT "Cafedagvoorwerp_pkey" PRIMARY KEY ("cafedagVoorwerpId")
);

-- CreateTable
CREATE TABLE "Voorwerp" (
    "voorwerpId" SERIAL NOT NULL,
    "volgnummer" TEXT NOT NULL,
    "klantId" INTEGER NOT NULL,
    "aanmeldingsDatum" TIMESTAMP(3) NOT NULL,
    "aanmeldingsTijd" TIMESTAMP(3) NOT NULL,
    "klaarDuur" TIMESTAMP(3),
    "voorwerpStatusId" INTEGER NOT NULL,
    "afdelingId" INTEGER NOT NULL,
    "voorwerpBeschrijving" TEXT,
    "klachtBeschrijving" TEXT,

    CONSTRAINT "Voorwerp_pkey" PRIMARY KEY ("voorwerpId")
);

-- CreateTable
CREATE TABLE "VoorwerpStatus" (
    "voorwerpStatusId" SERIAL NOT NULL,
    "naam" TEXT NOT NULL,

    CONSTRAINT "VoorwerpStatus_pkey" PRIMARY KEY ("voorwerpStatusId")
);

-- CreateTable
CREATE TABLE "Afdeling" (
    "afdelingId" SERIAL NOT NULL,
    "naam" TEXT NOT NULL,

    CONSTRAINT "Afdeling_pkey" PRIMARY KEY ("afdelingId")
);

-- CreateTable
CREATE TABLE "GebruikteMateriaal" (
    "gebruikteMateriaalId" SERIAL NOT NULL,
    "materiaalId" INTEGER NOT NULL,
    "voorwerpId" INTEGER NOT NULL,
    "aantal" INTEGER NOT NULL,

    CONSTRAINT "GebruikteMateriaal_pkey" PRIMARY KEY ("gebruikteMateriaalId")
);

-- CreateTable
CREATE TABLE "Materiaal" (
    "materiaalId" SERIAL NOT NULL,
    "naam" TEXT NOT NULL,

    CONSTRAINT "Materiaal_pkey" PRIMARY KEY ("materiaalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gebruiker_gebruikerNaam_key" ON "Gebruiker"("gebruikerNaam");

-- CreateIndex
CREATE UNIQUE INDEX "QRLogin_token_key" ON "QRLogin"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Cafedagvoorwerp_cafedagId_voorwerpId_key" ON "Cafedagvoorwerp"("cafedagId", "voorwerpId");

-- CreateIndex
CREATE UNIQUE INDEX "Voorwerp_volgnummer_key" ON "Voorwerp"("volgnummer");

-- AddForeignKey
ALTER TABLE "Gebruiker" ADD CONSTRAINT "Gebruiker_gebruikerTypeId_fkey" FOREIGN KEY ("gebruikerTypeId") REFERENCES "GebruikerType"("gebruikerTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessie" ADD CONSTRAINT "Sessie_gebruikerId_fkey" FOREIGN KEY ("gebruikerId") REFERENCES "Gebruiker"("gebruikerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QRLogin" ADD CONSTRAINT "QRLogin_gebruikerId_fkey" FOREIGN KEY ("gebruikerId") REFERENCES "Gebruiker"("gebruikerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cafedag" ADD CONSTRAINT "Cafedag_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("cafeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CafeGebruiker" ADD CONSTRAINT "CafeGebruiker_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("cafeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Klant" ADD CONSTRAINT "Klant_klantTypeId_fkey" FOREIGN KEY ("klantTypeId") REFERENCES "KlantType"("klantTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cafedagvoorwerp" ADD CONSTRAINT "Cafedagvoorwerp_cafedagId_fkey" FOREIGN KEY ("cafedagId") REFERENCES "Cafedag"("cafedagId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cafedagvoorwerp" ADD CONSTRAINT "Cafedagvoorwerp_voorwerpId_fkey" FOREIGN KEY ("voorwerpId") REFERENCES "Voorwerp"("voorwerpId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voorwerp" ADD CONSTRAINT "Voorwerp_klantId_fkey" FOREIGN KEY ("klantId") REFERENCES "Klant"("klantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voorwerp" ADD CONSTRAINT "Voorwerp_voorwerpStatusId_fkey" FOREIGN KEY ("voorwerpStatusId") REFERENCES "VoorwerpStatus"("voorwerpStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voorwerp" ADD CONSTRAINT "Voorwerp_afdelingId_fkey" FOREIGN KEY ("afdelingId") REFERENCES "Afdeling"("afdelingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GebruikteMateriaal" ADD CONSTRAINT "GebruikteMateriaal_materiaalId_fkey" FOREIGN KEY ("materiaalId") REFERENCES "Materiaal"("materiaalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GebruikteMateriaal" ADD CONSTRAINT "GebruikteMateriaal_voorwerpId_fkey" FOREIGN KEY ("voorwerpId") REFERENCES "Voorwerp"("voorwerpId") ON DELETE RESTRICT ON UPDATE CASCADE;
