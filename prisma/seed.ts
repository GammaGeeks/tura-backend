import { PrismaClient } from '@prisma/client';
import { encodePassword } from '../src/utils/bcrypt';
import { users as userData } from './seedData/users';
import { categories as categoryData } from './seedData/categories';
import { provinces as provinceData } from './seedData/provinces';
import { properties as propertyData } from './seedData/properties';
import { kigaliSectors } from './seedData/sectors';
import { places as placeData } from './seedData/places';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Users
  const createdUsers = [];
  for (const user of userData) {
    const hashedPassword = await encodePassword(user.password);
    const createdUser = await prisma.user.create({
      data: {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        gender: user.gender,
        address: user.address,
        dob: user.dob,
        phoneNumber: user.phoneNumber,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        password: hashedPassword,
        isVerified: user.isVerified,
        userSetting: {
          create: {
            notificationsOn: true, // Customize as needed
            smsEnabled: false, // Customize as needed
          },
        },
      },
    });
    createdUsers.push(createdUser);
  }

  console.log(`Seeded ${createdUsers.length} users.`);

  // 2. Seed Categories
  const createdCategories = [];
  for (const category of categoryData) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        details: category.details,
      },
    });
    createdCategories.push(createdCategory);
  }

  console.log(`Seeded ${createdCategories.length} categories.`);

  // 3. Seed Provinces, Districts, Sectors, and Places
  const createdProvinces = [];
  for (const province of provinceData) {
    const createdProvince = await prisma.province.create({
      data: {
        name: province.name,
        districts: {
          create: province.districts.map((district) => ({
            name: district.name,
          })),
        },
      },
    });

    createdProvinces.push(createdProvince);
  }

  console.log(`Seeded ${createdProvinces.length} provinces with districts`);

  // 4. Seed Sectors
  const createdSectors = [];
  for (const sector of kigaliSectors) {
    const createdSector = await prisma.sector.create({
      data: {
        name: sector.name,
        district: {
          connect: { id: sector.districtId }, // Ensure district IDs are correct
        },
      },
    });

    createdSectors.push(createdSector);
  }

  const createdPlaces = [];
  for (const place of placeData) {
    const createdPlace = await prisma.place.create({
      data: {
        name: place.name,
        sector: {
          connect: { id: place.sectorId }, // Ensure sector IDs are correct
        },
      },
    });
    createdPlaces.push(createdPlace);
  }
  console.log(`Seeded ${createdPlaces.length} places.`);

  console.log(`Seeded ${createdSectors.length} sectors for Kigali.`);

  // 4. Seed Properties
  for (const property of propertyData) {
    // Find a user to associate with the property (e.g., the first user)
    const user = createdUsers[0]; // Adjust as needed

    // Find a category to associate with the property (e.g., the first category)
    const category = createdCategories[0]; // Adjust as needed

    // Find a place to associate with the property (e.g., the first place)
    const place = await prisma.place.findFirst();
    if (!place) {
      throw new Error(
        'No places found. Ensure provinces are seeded correctly.',
      );
    }

    await prisma.property.create({
      data: {
        title: property.title,
        details: property.details,
        price: property.price,
        size: property.size,
        hasParking: property.hasParking,
        isForSale: property.isForSale,
        isForRent: property.isForRent,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        isSold: property.isSold,
        hasPool: property.hasPool,
        appliances: property.appliances,
        yearBuilt: property.yearBuilt,
        AC: property.AC,
        YTUrl: property.YTUrl,
        slug: property.slug,
        owner: {
          connect: { id: user.id },
        },
        category: {
          connect: { id: category.id },
        },
        place: {
          connect: { id: place.id },
        },
      },
    });
  }

  console.log(`Seeded ${propertyData.length} properties.`);
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
