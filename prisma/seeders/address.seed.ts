import { PrismaClient } from '@prisma/client';

export async function seedAddresses(prisma: PrismaClient) {
  await prisma.address.createMany({
    data: [
      {
        addressDetail: 'Tòa nhà StarLake Tây Hồ',
        city: 'Hà Nội',
        district: 'Cầu Giấy',
        userId: 'daocongvan001',
        ward: 'Nghĩa Đô',
        street: 'Võ Chí Công'
      },
      {
        addressDetail: 'Ngách 31/108',
        city: 'Hà Nội',
        district: 'Hà Đông',
        userId: 'daocongvan001',
        ward: 'Mỗ Lao',
        street: 'Nguyễn Văn Trỗi'
      },
      {
        addressDetail: 'Ngách 11/202',
        city: 'Hà Nội',
        district: 'Hà Đông',
        userId: 'daoxuandong001',
        ward: 'Mỗ Lao',
        street: 'Nguyễn Thanh Bình',
        houseNumber: '33'
      },
      {
        addressDetail: 'Gần Đại học Công nghiệp',
        city: 'Hà Nội',
        district: 'Bắc Từ Liêm',
        userId: 'daoxuandong001',
        ward: 'Nhổn',
        street: 'Nguyễn Chí Thanh',
        houseNumber: '12',
      }
    ],
    skipDuplicates: true, // Bỏ qua các bản ghi đã tồn tại nếu bạn không muốn xóa
  });
}
