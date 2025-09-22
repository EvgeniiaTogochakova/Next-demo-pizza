import { Textarea } from '../../ui';
import { FormInput } from '../form';
import { WhiteBlock } from '../WhiteBlock';

interface Props {
  className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title="3. Адрес доставки">
      <div className="flex flex-col gap-5">
        <FormInput name="firstName" className="text-base" placeholder="Введите адрес" />
        <Textarea className="text-base" rows={5} placeholder="Комментарий к заказу" />
      </div>
    </WhiteBlock>
  );
};
