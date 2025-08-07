import { Container, TopBar } from '@/components/shared';
import { Title } from '@/components/shared/Title';

export default function Home() {
  return (
    <>
    <Container className="mt-10 border" >
      <Title text="Все пиццы" size="lg" className="font-extrabold" />
    </Container>
    <TopBar/>
    </>
  );
}
