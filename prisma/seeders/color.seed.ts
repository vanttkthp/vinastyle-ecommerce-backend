import { PrismaClient } from '@prisma/client';

export async function seedColors(prisma: PrismaClient) {
  await prisma.color.createMany({
    data: [
      {
        colorId: 'red',
        name: ['RED'],
        hexCode: ['#FF0000']
      },
      {
        colorId: 'yellow',
        name: ['Yellow'],
        hexCode: ['#FFFF00']
      },
      {
        colorId: 'cyan',
        name: ['CYAN'],
        hexCode: ['#00FFFF']
      },
      {
        colorId: 'white',
        name: ['WHITE'],
        hexCode: ['#FFFFFF']
      },
      {
        colorId: 'black',
        name: ['BLACK'],
        hexCode: ['#000000']
      },
      {
        colorId: 'beige',
        name: ['BEIGE'],
        hexCode: ['#F5F5DC']
      },
      {
        colorId: 'pink',
        name: ['PINK'],
        hexCode: ['#FFC0CB']
      },
      {
        colorId: 'blue',
        name: ['BLUE'],
        hexCode: ['#1460B3']
      },
      {
        colorId: 'brown',
        name: ['BROWN'],
        hexCode: ['#592E06']
      },
      {
        colorId: 'green',
        name: ['GREEN'],
        hexCode: ['#25CC57']
      },
      {
        colorId: 'yellow',
        name: ['YELLOW'],
        hexCode: ['#DBE03F']
      },
      {
        colorId: 'purple',
        name: ['PURPLE'],
        hexCode: ['#853DB3']
      },
      {
        colorId: 'grey',
        name: ['GRAY'],
        hexCode: ['#808080']
      },
    ],
    skipDuplicates: true, // Bỏ qua các bản ghi đã tồn tại nếu bạn không muốn xóa
  });
}
