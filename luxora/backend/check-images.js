const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const totalImages = await p.productImage.count();
  console.log(`Total ProductImage rows: ${totalImages}`);

  const primaryImages = await p.productImage.count({ where: { isPrimary: true } });
  console.log(`ProductImage rows with isPrimary=true: ${primaryImages}`);

  // Sample a few products with their images
  const products = await p.product.findMany({
    take: 5,
    include: { images: true },
  });

  console.log('\n=== SAMPLE PRODUCTS ===');
  products.forEach(prod => {
    console.log(`\n${prod.name} (sku: ${prod.sku})`);
    if (prod.images.length === 0) {
      console.log('  NO IMAGES');
    } else {
      prod.images.forEach(img => {
        console.log(`  - url: ${img.url}`);
        console.log(`    isPrimary: ${img.isPrimary}, sortOrder: ${img.sortOrder}`);
      });
    }
  });

  await p.$disconnect();
}

main().catch(console.error);