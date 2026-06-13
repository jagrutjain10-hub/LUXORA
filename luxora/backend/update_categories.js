const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Add new categories
  const created = await p.category.createMany({
    data: [
      { name: 'Wall Lamps', slug: 'wall-lamps', description: 'Elegant wall-mounted lighting fixtures', sortOrder: 2 },
      { name: 'Lamps', slug: 'lamps', description: 'Premium floor and table lamps', sortOrder: 3 },
      { name: 'Hangings', slug: 'hangings', description: 'Decorative hanging lights and pendants', sortOrder: 4 },
      { name: 'Lights', slug: 'lights', description: 'Modern ceiling and ambient lighting', sortOrder: 5 },
    ],
    skipDuplicates: true,
  });
  console.log('Created:', created);

  // Deactivate old categories
  const deactivated = await p.category.updateMany({
    where: { slug: { in: ['lighting','vases','sculptures','mirrors','candles','cushions','wall-art'] } },
    data: { isActive: false },
  });
  console.log('Deactivated:', deactivated);

  await p.$disconnect();
}

main().catch(console.error);