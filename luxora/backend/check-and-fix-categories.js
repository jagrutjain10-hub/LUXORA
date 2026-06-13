const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // 1. Show all categories and how many products each has
  const categories = await p.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' },
  });
  console.log('\n=== CATEGORIES ===');
  categories.forEach(c => {
    console.log(`${c.isActive ? '✅' : '❌'} ${c.name} (${c.slug}) - ${c._count.products} products - id: ${c.id}`);
  });

  // 2. Show all products and which category they point to
  const products = await p.product.findMany({
    include: { category: true },
  });
  console.log('\n=== PRODUCTS ===');
  products.forEach(prod => {
    console.log(`${prod.name} -> category: ${prod.category?.name ?? 'MISSING'} (active: ${prod.category?.isActive})`);
  });

  // 3. Find products pointing to inactive/old categories
  const orphaned = products.filter(prod => !prod.category || !prod.category.isActive);
  if (orphaned.length > 0) {
    console.log('\n=== PRODUCTS LINKED TO INACTIVE/MISSING CATEGORIES ===');
    orphaned.forEach(prod => console.log(`${prod.name} (id: ${prod.id}) -> ${prod.category?.name ?? 'NONE'}`));

    // ─── UNCOMMENT BELOW TO REASSIGN THESE PRODUCTS TO A NEW CATEGORY ───
    // const targetCategory = await p.category.findUnique({ where: { slug: 'lamps' } }); // change slug as needed
    // for (const prod of orphaned) {
    //   await p.product.update({ where: { id: prod.id }, data: { categoryId: targetCategory.id } });
    //   console.log(`Reassigned ${prod.name} -> ${targetCategory.name}`);
    // }
  } else {
    console.log('\nAll products linked to active categories. ✅');
  }

  await p.$disconnect();
}

main().catch(console.error);
