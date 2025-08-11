import { Container, Filters, ProductCard, ProductsGroupList, TopBar } from '@/components/shared';
import { Title } from '@/components/shared/Title';

export default function Home() {
  return (
    <>
      <Container className="mt-10 border">
        <Title text="Все пиццы" size="lg" className="font-extrabold" />
      </Container>
      <TopBar />

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
              <ProductsGroupList
                title="Пиццы"
                categoryId={1}
                items={[
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                ]}
              />
              <ProductsGroupList
                title="Завтрак"
                categoryId={1}
                items={[
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                  {
                    id: 0,
                    name: 'Чизбургер-пицца',
                    price: 550,
                    items: [{ price: 550 }],
                    imageUrl:
                      'https://images.spasibovsem.ru/catalog/original/pitstsa-dodo-pitstsa-chizburger-otzyvy-1557423991.jpg',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
