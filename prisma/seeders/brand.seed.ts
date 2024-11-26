import { PrismaClient } from '@prisma/client';

export async function seedBrands(prisma: PrismaClient) {
  await prisma.brand.createMany({
    data: [
      {
        name: '$MAKER',
        brandId: 'smaker',
      },
      {
        name: 'DIRTYCOINS',
        brandId: 'dirtycoins'
      },
      {
        name: 'Lonely Stonie',
        brandId: 'lonelystonie'
      },
      {
        name: 'MLB',
        brandId: 'mlb'
      }
    ],
    skipDuplicates: true, // Bỏ qua các bản ghi đã tồn tại nếu bạn không muốn xóa
  });
}
