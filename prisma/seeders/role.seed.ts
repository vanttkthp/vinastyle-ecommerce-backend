import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  await prisma.role.createMany({
    data: [
      {
        roleName: 'ADMIN',
        description: 'ADMIN have all permissions'
      },
      {
        roleName: 'CUSTOMER',
        description: 'Customer permission'
      },
      {
        roleName: 'STAFF',
        description: 'Staff permission'
      }
    ],
    skipDuplicates: true, // Bỏ qua các bản ghi đã tồn tại nếu bạn không muốn xóa
  });
}
