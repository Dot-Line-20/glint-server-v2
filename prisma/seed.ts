import prisma from 'lib/prisma'

const seed = async () => {
  await prisma.products.createMany({
    data: [
      {
        name: '프린터 무제한 이용권',
        price: 8000,
        detail: '한달 동안 프린터를 제한 없이 이용해보세요.',
      },
      {
        name: '아이스크림 무제한 이용권',
        price: 9000,
        detail: '한달 동안 원하는 아이스크림은 마음껏 골라보세요.',
      },
      {
        name: '카드결제 안되는 상품',
        price: 10,
        detail: '10원은 카드결제가 되지 않습니다.',
      },
    ],
  })
}

seed()
