import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  await prisma.user.createMany({
    data: [
      {
        email: 'daocongvan@vinastyle.com',
        password: '12345678',
        firstName: 'Dao',
        lastName: 'Cong Van',
        gender: 'MALE',
        roleName: 'ADMIN',
        phoneNumber: '0965373958',
        userId: 'daocongvan001'
      },
      {
        email: 'ngoquangtruong@vinastyle.com',
        password: '12345678',
        firstName: 'Ngo',
        lastName: 'Quang Truong',
        gender: 'FEMALE',
        roleName: 'STAFF',
        phoneNumber: '0965678900',
        userId: 'ngoquangtruong001'
      },
      {
        email: 'daoxuandong@vinastyle.com',
        password: '12345678',
        firstName: 'Dao',
        lastName: 'Xuan Dong',
        gender: 'OTHER',
        roleName: 'CUSTOMER',
        phoneNumber: '0965678911',
        userId: 'daoxuandong001'
      }
    ],
    skipDuplicates: true, // Bỏ qua các bản ghi đã tồn tại nếu bạn không muốn xóa
  });
}
