// prisma/seedData/users.ts

export const users = [
  {
    fullname: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
    gender: 'Male',
    address: '123 Main St, Kigali',
    dob: new Date('1990-01-01'),
    phoneNumber: '+1234567890',
    profileImg: 'profile1.jpg',
    coverImg: 'cover1.jpg',
    password: 'password123', // Will be hashed in seed.ts
    isVerified: true,
  },
  {
    fullname: 'Jane Smith',
    username: 'janesmith',
    email: 'janesmith@example.com',
    gender: 'Female',
    address: '456 Oak Ave, Kigali',
    dob: new Date('1985-05-15'),
    phoneNumber: '+0987654321',
    profileImg: 'profile2.jpg',
    coverImg: 'cover2.jpg',
    password: 'securepass', // Will be hashed in seed.ts
    isVerified: false,
  },
];
