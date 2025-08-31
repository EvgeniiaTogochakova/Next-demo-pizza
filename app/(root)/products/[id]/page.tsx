import { Container, GroupVariants, ProductImage, Title } from '@/shared/components/shared';
import { ProductWithRelations } from '@/@types/prisma-types';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const product: ProductWithRelations | null = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      items: true,
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-10">
      <div className="flex flex-1">
        <ProductImage imageUrl={product.imageUrl} size={30} />
        {/* <div className='w-[490px] bg-[#FCFCFC] p-7'> */}
        <div className="w-[490px] bg-[#f7f6f5] p-7">
          <Title text={product.name} size="md" className="font-exrabold mb-1" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique veniam sed, dolorem
            inventore vel culpa harum dolore enim quaerat itaque unde ullam odio, aut cum soluta
            repellat laboriosam! Impedit eius ratione unde veniam obcaecati odio explicabo ipsa
            rerum autem iure eum, amet rem. Quaerat magnam iure deserunt aspernatur optio, aliquam
            autem molestiae sunt, possimus dolorum, provident doloremque in? Ullam, ipsum magnam?
            Voluptates ipsa dolores nam rerum nesciunt corrupti, quasi enim, atque ratione a ad
            veritatis similique dicta id est esse nulla qui dolor perspiciatis illo dignissimos
            pariatur? Ab, ea eum animi quod vel modi ipsum illo. Dolor distinctio recusandae aut?
          </p>
          <GroupVariants
            items={[
              { name: 'Маленькая', value: '1' },
              { name: 'Средняя', value: '2' },
              { name: 'Большая', value: '3', disabled: true },
            ]}
            value="2"
          />
        </div>
      </div>
    </Container>
  );
}
