// prisma/seedData/provinces.ts

export const provinces = [
  {
    name: 'Kigali',
    districts: [
      {
        name: 'Gasabo',
        sectors: [
          {
            name: 'Kacyiru',
            places: [{ name: 'Place A' }, { name: 'Place B' }],
          },
          {
            name: 'Kimironko',
            places: [{ name: 'Place C' }, { name: 'Place D' }],
          },
        ],
      },
      {
        name: 'Kicukiro',
        sectors: [
          {
            name: 'Gisozi',
            places: [{ name: 'Place E' }, { name: 'Place F' }],
          },
        ],
      },
      {
        name: 'Nyarugenge',
        sectors: [
          {
            name: 'Nyamirambo',
            places: [{ name: 'Place G' }, { name: 'Place H' }],
          },
          {
            name: 'Nyarugenge',
            places: [{ name: 'Place I' }, { name: 'Place J' }],
          },
        ],
      },
    ],
  },
  {
    name: 'Southern Province',
    districts: [
      {
        name: 'Huye',
        sectors: [
          {
            name: 'Nyanza',
            places: [{ name: 'Place G' }],
          },
        ],
      },
    ],
  },
];
