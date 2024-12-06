import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reverseSeed = async () => {
  try {
    // Delete Places first (assuming they are the most independent entities)
    await prisma.place.deleteMany();

    // Delete Sectors
    await prisma.sector.deleteMany();

    // Delete Districts
    await prisma.district.deleteMany();

    // Finally, delete Provinces
    await prisma.province.deleteMany();

    console.log('Data reversed and deleted successfully.');
  } catch (error) {
    console.error('Error during reversing seeds:', error);
  } finally {
    await prisma.$disconnect();
  }
};

reverseSeed();
