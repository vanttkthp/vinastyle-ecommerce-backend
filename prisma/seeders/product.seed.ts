import { PrismaClient } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient) {


  await prisma.product.createMany({
    data: [
      {
        productId: 'tops-t-shirts-001',
        name: 'Áo thun unisex cổ tròn tay ngắn Basic Mega Logo',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 1590000,
        description: 'T-SHIRTS',
      },
      {
        productId: 'tops-t-shirts-002',
        name: 'Áo thun unisex cổ tròn tay ngắn Sportive Varsity Track',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 1690000,
        description: 'Oversize - Unisex - Model wears size L',
      },
      {
        productId: 'tops-t-shirts-003',
        name: 'Áo thun unisex cổ tròn tay ngắn Vintage Big Logo Graphic',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 1690000,
        description: 'Oversize - Unisex - Model wears size L',
      },
      {
        productId: 'tops-t-shirts-004',
        name: 'Áo thun unisex cổ tròn tay ngắn Vintage CityLife Graphic',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 1690000,
        description: 'Oversize - Unisex - Model wears size L',
      },
      {
        productId: 'tops-t-shirts-005',
        name: 'Áo thun unisex cổ tròn tay ngắn Street Lettering Overfit',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 1690000,
        description: 'Oversize - Unisex - Model wears size L',
      },
      {
        productId: 'tops-t-shirts-006',
        name: 'Áo thun unisex cổ tròn tay ngắn Basic Small Logo Functional',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 1190000,
        description: 'Oversize - Unisex - Model wears size L',
      },
      {
        productId: 'tops-t-shirts-007',
        name: 'Áo thun unisex cổ tròn tay ngắn Vintage Sports Functional Big Logo',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 1890000,
        description: 'Oversize - Unisex - Model wears size L',
      },
      {
        productId: 'tops-t-shirts-008',
        name: 'Áo thun unisex cổ V tay ngắn Varsity Soccer Jersey',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 2590000,
        description: 'Oversize - Unisex - Model wears size L',
      },
      {
        productId: 'tops-t-shirts-009',
        name: 'Áo thun unisex cổ tròn tay ngắn Varsity Overfit',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 1390000,
        description: 'Oversize - Unisex - Model wears size L',
      },
      {
        productId: 'tops-t-shirts-010',
        name: 'Áo thun unisex cổ tròn tay ngắn Varsity Mega Bear Overfit',
        brandId: 'mlb',
        categoryId: 'tops',
        subCategoryId: 'tops-t-shirts',
        price: 1690000,
        description: 'Oversize - Unisex - Model wears size L',
      },
    ],
    skipDuplicates: true, // Bỏ qua các bản ghi đã tồn tại nếu bạn không muốn xóa
  });
}
