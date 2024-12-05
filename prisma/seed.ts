import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/.";

const prisma = new PrismaClient

async function main() {
     for (let index = 1; index < 11; index++) {
        const uniqueSuffix = `user${index}`;

        // Create User
        await prisma.user.create({
            data: {
                fullname: `Full Name ${index}`,
                username: uniqueSuffix, // Unique username
                email: `user${index}@example.com`,
                gender: index % 2 === 0 ? "Male" : "Female", // Alternate gender
                address: `Street ${index}, City, Country`,
                dob: new Date(1990 + index, index % 12, index % 28 + 1), // Unique birthdate
                phoneNumber: `+123456789${index}`,
                password: `password${index}`, // Simple password for testing
            },
        });

        // Create Sector
        await prisma.sector.create({
            data: {
                name: `Sector ${index}`,
            },
        });

        // Create District
        await prisma.district.create({
            data: {
                name: `District ${index}`,
            },
        });

        // Create Province
        await prisma.province.create({
            data: {
                name: `Province ${index}`,
            },
        });

        // Create Place
        await prisma.place.create({
            data: {
                provinceId: Math.max(1, index % 10), // Reference to existing provinces
                districtId: Math.max(1, index % 10), // Reference to existing districts
                sectorId: Math.max(1, index % 10), // Reference to existing sectors
            },
        });

        // Create Category
        await prisma.category.create({
            data: {
                name: `Category ${index}`,
            },
        });

        // Create Property
        await prisma.property.create({
            data: {
                title: `Property Title ${index}`,
                description: `This is a detailed description of Property ${index}.`,
                imageIds: [`image_${index}_1.jpg`, `image_${index}_2.jpg`], // Static images
                price: 1000 * index, // Incremental pricing
                size: 50 + index, // Incremental size
                info: index % 2 === 0 ? "SALE" : "RENT", // Alternate info
                hasParking: index % 2 === 0, // Alternate boolean
                hasPlot: index % 3 === 0, // Alternate boolean
                userId: Math.max(1, index % 10), // Reference to existing users
                categoryId: Math.max(1, index % 10), // Reference to existing categories
                location: Math.max(1, index % 10), // Reference to existing places
            },
        });
    }
}

main().catch((e)=> {
    console.error(e)
    process.exit(1)
}).finally( async ()=> {
    await prisma.$disconnect()
})