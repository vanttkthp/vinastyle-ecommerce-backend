import { PrismaClient } from '@prisma/client';

export async function seedSizes(prisma: PrismaClient) {
  await prisma.size.createMany({
    data: [
      {
        sizeType: 'L',
        sizeId: 'l',
      },
      {
        sizeType: 'M',
        sizeId: 'm',
      },
      {
        sizeType: 'S',
        sizeId: 's',
      },
      {
        sizeType: 'XS',
        sizeId: 'xs',
      },
      {
        sizeType: 'XXL',
        sizeId: 'xxl',
      },
      {
        sizeType: 'XL',
        sizeId: 'xl',
      },
    ],
    skipDuplicates: true, // Bỏ qua các bản ghi đã tồn tại nếu bạn không muốn xóa
  });
}
