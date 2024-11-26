import { PrismaClient } from '@prisma/client';
import { seedUsers } from './user.seed';
import { seedAddresses } from './address.seed';
import { seedRoles } from './role.seed';
import { seedSubCategories } from './sub-category.seed';
import { seedCategories } from './category.seed';
import { seedBrands } from './brand.seed';
import { seedColors } from './color.seed';
import { seedSizes } from './size.seed';
import { seedProducts } from './product.seed';
import { seedProductVariants } from './product-variant.seed';
import { seedImages } from './image.seed';
// import thêm các seed khác

const prisma = new PrismaClient();

async function main() {
  await seedRoles(prisma);
  await seedUsers(prisma);
  // await seedAddresses(prisma)

  await seedCategories(prisma);
  await seedSubCategories(prisma);
  await seedBrands(prisma);
  await seedColors(prisma);
  await seedSizes(prisma);
  await seedProducts(prisma);
  await seedProductVariants(prisma);
  await seedImages(prisma)
  // Gọi các seed khác
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
