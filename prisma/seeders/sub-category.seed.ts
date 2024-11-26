import { PrismaClient } from '@prisma/client';

export async function seedSubCategories(prisma: PrismaClient) {
  // Tùy chọn 1: Xóa tất cả các bản ghi hiện có
  await prisma.subCategory.createMany({
    data: [
      {
        name: 'T-SHIRTS',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
      },
      {
        name: 'POLO SHIRTS',
        categoryId: 'tops',
        subCategoryId: 'tops-polo-shirts',
      },
      {
        name: 'SHIRTS',
        categoryId: 'tops',
        subCategoryId: 'tops-shirts',
      },
      {
        name: 'SWEATSHIRTS',
        categoryId: 'tops',
        subCategoryId: 'tops-sweatshirts',
      },
      {
        name: 'HOODIES',
        categoryId: 'tops',
        subCategoryId: 'tops-hoodies',
      }
    ],
    skipDuplicates: true,
  });
}
