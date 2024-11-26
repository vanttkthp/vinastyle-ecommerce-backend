import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {

  // Tùy chọn 2: Hoặc sử dụng skipDuplicates
  await prisma.category.createMany({
    data: [
      {
        name: 'TOPS',
        categoryId: 'tops',
      },
      {
        name: 'BOTTOMS',
        categoryId: 'bottoms',
      },
      {
        name: 'ACCESSORIES',
        categoryId: 'accessories',
      },
      {
        name: 'WOMENSWEAR',
        categoryId: 'womenswear',
      },
      {
        name: 'BAGS',
        categoryId: 'bags',
      },
      {
        name: 'OUTER',
        categoryId: 'outer',
      },
    ],
    skipDuplicates: true, // Bỏ qua các bản ghi đã tồn tại nếu bạn không muốn xóa
  });
}
