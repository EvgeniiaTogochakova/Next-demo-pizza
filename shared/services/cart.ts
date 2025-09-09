import { ApiRoutes } from './constants';
import { axiosInstance } from './instance';
import { CartDTO } from './dto/cart.dto';

export const fetchCart = async (): Promise<CartDTO> => {
  return (await axiosInstance.get<CartDTO>(ApiRoutes.CART)).data;
   
};
