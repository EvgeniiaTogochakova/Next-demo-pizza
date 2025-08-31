'use client';

import { Container, Filters, ProductsGroupList, TopBar } from '@/shared/components/shared';
import { Title } from '@/shared/components/shared/Title';
import { useCategories } from '@/shared/hooks';

export default function Home() {
  const { categories } = useCategories();

  // const categories = await prisma.category.findMany({});
  // console.log(categories);
  // console.log(categories[0].products);

  return (
    <>
      <Container className="mt-10 border">
        <Title text="Все пиццы" size="lg" className="font-extrabold" />
      </Container>
      <TopBar categories={categories.filter((category) => category.products.length > 0)} />

      <Container className="mt-10 pb-14 border">
        <div className="flex gap-[80px]">
          {/* Фильтрация  */}
          <div className="w-250px">
            <Filters />
          </div>

          {/* Список товаров */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {/* <ProductCard id={0} name='Чизбургер-пицца' price={550} imageUrl='https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg' /> */}
              {/* Список товаров */}
              <div className="flex-1">
                <div className="flex flex-col gap-16">
                  {categories.map(
                    (category) =>
                      category.products?.length > 0 && (
                        <ProductsGroupList
                          key={category.id}
                          title={category.name}
                          categoryId={category.id}
                          items={category.products}
                        />
                      ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
