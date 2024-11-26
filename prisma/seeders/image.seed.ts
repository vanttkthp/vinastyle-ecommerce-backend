import { PrismaClient } from '@prisma/client';

export async function seedImages(prisma: PrismaClient) {
  // Tùy chọn 2: Hoặc sử dụng skipDuplicates
  await prisma.image.createMany({
    data: [
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/43crs_3atsb0244_1_710fbb879830495c86c4f6601219020e_622606173f4f47058c9def2377eedcdd_master.jpg',
        productId: 'tops-t-shirts-001',
        colorId: 'beige',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/43crs_3atsb0244_2_8e673bb63c8940599aa53bddfb244a54_40907d12c52d4c4ca9c49f8153620e2e_master.jpg',
        productId: 'tops-t-shirts-001',
        colorId: 'beige',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/43crs_3atsb0244_3_05c3c3a23a264fdaba4a0469ecc0d5e2_1b25b5fa740f48d3b6abf33f7152429e_master.jpg',
        productId: 'tops-t-shirts-001',
        colorId: 'beige',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/50bks_3atsb0244_1_e3e40a14fb1248d4a4f81c7a7a71f703_05732056941b4392bcca6d40fb665b50_master.jpg',
        productId: 'tops-t-shirts-001',
        colorId: 'black',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/50bks_3atsb0244_2_a475d651d95545c7b9eca32879b437ad_c7336dad334e4c8ab502ae33bdb10fd8_master.jpg',
        productId: 'tops-t-shirts-001',
        colorId: 'black',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/50bks_3atsb0244_3_41e0e44cf6c44f32898614d0aa33aafc_9f1b880ffd934146985bd4e265bb858e_master.jpg',
        productId: 'tops-t-shirts-001',
        colorId: 'black',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/43bks_3atsv2143_1_5c2f075f77744e7c91c793ac923bc7ec_8dffdf7d799d4d6e98aec03b06492ae4_master.jpg',
        productId: 'tops-t-shirts-002',
        colorId: 'black',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/43bks_3atsv2143_2_691d16ae7d604c42b3ba7a9a5306983c_9c8a5f0d2bff46f398746b79d250d077_master.jpg',
        productId: 'tops-t-shirts-002',
        colorId: 'black',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/43bks_3atsv2143_4_ae8e6d1ebfe44b0fa8a3dae60a597953_381cf1b98ce84e3cb834694073041426_master.jpg',
        productId: 'tops-t-shirts-002',
        colorId: 'black',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/07pkm_3atsn0343_1_05e8ff7849804658b83b742bcc55229b_3fce77bba63240139cba860f6129a782_master.jpg',
        productId: 'tops-t-shirts-003',
        colorId: 'pink',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/07pkm_3atsn0343_2_7346ec7ae281413f98fb06f39a4aa10a_001fff5cf976498b825497b3ad5deebe_master.jpg',
        productId: 'tops-t-shirts-003',
        colorId: 'pink',
      },
      {
        imageURL:
          'https://product.hstatic.net/200000642007/product/07pkm_3atsn0343_3_64ede82b4d5845ecb97929305de93e7d_56357f32a6fa41f9aab77dec4d31d3a8_master.jpg',
        productId: 'tops-t-shirts-003',
        colorId: 'pink',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/43inp_3atsn0143_1_72db649ad75347b5bfb444835cde6540_4420f76d42bf4525b44a777baadc6a22_master.jpg',
        productId: 'tops-t-shirts-004',
        colorId: 'blue',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/43inp_3atsn0143_2_a41bc8d6a9a14beeb0219997031e623f_1537bbafe6fa4d08aacc4d7c161c1d66_master.jpg',
        productId: 'tops-t-shirts-004',
        colorId: 'blue',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/43inp_3atsn0143_3_fc4fafe28b474a5a9e7b4895dfd22a22_48525751227d47edac75b7cf65eb4bdd_master.jpg',
        productId: 'tops-t-shirts-004',
        colorId: 'blue',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/50bks_3atsb2243_1_d763c980bbfe4c4582481f8a86d323f4_3aaf56f3dfb843678c3cf224ed8b580e_master.jpg',
        productId: 'tops-t-shirts-005',
        colorId: 'black',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/50bks_3atsb2243_2_52e19f93f95f42c9aaa9eff7c4518313_fc6792da16754593aa4bf6c79c76ff11_master.jpg',
        productId: 'tops-t-shirts-005',
        colorId: 'black',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/50bks_3atsb2243_3_04a1f0780d184166be51ba699f653b35_3bf9c3be412748aa8baff2d7894607bc_master.jpg',
        productId: 'tops-t-shirts-005',
        colorId: 'black',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/13brd_3atsb0443_1_b5368a94a660438b8fe278cefd0c1350_93ec4cd9a3d548a8a8dd0592af198548_master.jpg',
        productId: 'tops-t-shirts-006',
        colorId: 'brown',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/13brd_3atsb0443_2_4c188fbf281f4a05826a8b95fb53ac81_8070cf01ddbb4004affd4cee91cd6d52_master.jpg',
        productId: 'tops-t-shirts-006',
        colorId: 'brown',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/13brd_3atsb0443_3_b0b17dfcc56048c4ab96827c5d4743ff_d5e6c740f7c64718a6ef292d61bcd70c_master.jpg',
        productId: 'tops-t-shirts-006',
        colorId: 'brown',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/07gnm_3atsv0943_1_df7a85adb98c4a94ac765b8ffb726379_6469af82c48745759e76e61e18c8bc7d_master.jpg',
        productId: 'tops-t-shirts-007',
        colorId: 'green',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/07gnm_3atsv0943_2_5b000eda81b3476f813749e4aff0104a_cee1d48d584b4e7d8388d5051ab26db3_master.jpg',
        productId: 'tops-t-shirts-007',
        colorId: 'green',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/07gnm_3atsv0943_3_8bbe6d1354aa45d599d1fc02db42b7fb_d24a07cf995e4211a6b30021c43c2fcb_master.jpg',
        productId: 'tops-t-shirts-007',
        colorId: 'green',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/43rdl_3atsv1143_1_763fbd6595d4420e8ce4939490ac6aa6_147730400bf740a8b2045e86de29cdf4_master.jpg',
        productId: 'tops-t-shirts-008',
        colorId: 'red',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/43rdl_3atsv1143_2_9fb796bf81db4b1581d6f21ecb58ade9_5629985db9f44caa8ec58dc65342a538_master.jpg',
        productId: 'tops-t-shirts-008',
        colorId: 'red',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/43rdl_3atsv1143_3_4542327ed9354dd685a37845cd518cfe_b9751c14a0e240cf838d2ad95c81ecb6_master.jpg',
        productId: 'tops-t-shirts-008',
        colorId: 'red',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/10vos_3atsv0243_1_031a047fe094468898c1f998304f933d_b3c4d0be29fb43fda055162f31bca1fc_master.jpg',
        productId: 'tops-t-shirts-009',
        colorId: 'purple',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/10vos_3atsv0243_2_2c5013bbf4c443c6964117aba0526e20_4f2f8f1c1eb0473b92beebbbd736bfe2_master.jpg',
        productId: 'tops-t-shirts-009',
        colorId: 'purple',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/10vos_3atsv0243_3_2db76b22058a4524b2270c1440dfdc01_479439feb22142189663d61b6576b925_master.jpg',
        productId: 'tops-t-shirts-009',
        colorId: 'purple',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/45bgl_3atse0243_1_c3ffeb527ab04946a608ea252478c1b8_073c420d61174633bd55b924a8d9cc98_master.jpg',
        productId: 'tops-t-shirts-010',
        colorId: 'beige',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/45bgl_3atse0243_2_bef119b02fee43549a2fc1f8ece7dbf1_d92ea87f07ef4b1c8de1eb6b651ddb9b_master.jpg',
        productId: 'tops-t-shirts-010',
        colorId: 'beige',
      },
      {
        imageURL: 'https://product.hstatic.net/200000642007/product/45bgl_3atse0243_3_a5df57aa61cc424a89c38c307a410eba_a1a4e4b6ea9d4f3ca95c5a3cf14dee7d_master.jpg',
        productId: 'tops-t-shirts-010',
        colorId: 'beige',
      },
    ],
    skipDuplicates: true, // Bỏ qua các bản ghi đã tồn tại nếu bạn không muốn xóa
  });
}
