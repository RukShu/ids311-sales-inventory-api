import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ItemDTO } from '../../dto/item.dto';
import { PaymentDTO } from '../../dto/payment.dto';
import { SaleDTO } from '../../dto/sale.dto';
import { SalesDTO } from '../../dto/sales.dto';
import { UserDTO } from '../../dto/user.dto';
import { Payment } from '../../entities/payment.entity';
import { User } from '../../entities/user.entity';
import { ItemRepository } from '../../repositories/item.repository';
import { PaymentRepository } from '../../repositories/payment.repository';
import { SaleRepository } from '../../repositories/sale.repository';
import { UserRepository } from '../../repositories/user.repository';
import { assign } from '../../utils/object-manipulation';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly itemRepository: ItemRepository,
    private readonly saleRepository: SaleRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  getUsers = async (): Promise<User[]> => {
    return await this.userRepository.getAll();
  };

  createUser = async (userDto: UserDTO): Promise<User> => {
    return await this.userRepository.createUser(userDto);
  };

  getUser = async (id: string): Promise<User> => {
    return await this.userRepository.getUser(id);
  };

  updateUser = async (userDto: UserDTO): Promise<User> => {
    return await this.userRepository.updateUser(userDto);
  };

  deleteUser = async (id: string): Promise<User> => {
    return await this.userRepository.deleteUser(id);
  };

  createUserPayment = async (
    id: string,
    salesDto: SalesDTO,
  ): Promise<Payment> => {
    try {
      console.log(id);
      console.log({ salesDto });
      console.log(salesDto.sales);
      await this.getUser(id);
      const payment = new Payment();
      payment.id = randomUUID();
      payment.idUser = id;
      payment.amount = 0;
      salesDto.sales.forEach(async (saleDto: SaleDTO) => {
        saleDto.idPayment = payment.id;
        const item = await this.itemRepository.getItem(saleDto.idItem);
        saleDto.price = Number(item.price) * Number(saleDto.quantity);

        item.stock -= saleDto.quantity;
        if (item.stock < 0 || saleDto.quantity < 1)
          throw RangeError('Stock or Quantity is invalid number.');

        const itemDto = new ItemDTO();
        assign(itemDto, item);

        console.log(itemDto);
        console.log(saleDto);
        payment.amount += Number(saleDto.price);
        console.log(payment.amount + Number(saleDto.price));
        await this.itemRepository.updateItem(itemDto);
      });
      console.log(payment);

      const paymentDto = new PaymentDTO();
      assign(paymentDto, payment);
      await this.paymentRepository.createPayment(paymentDto);
      salesDto.sales.forEach(async (saleDto: SaleDTO) => {
        await this.saleRepository.createSale(saleDto);
      });
      console.log(paymentDto);
      return payment;
    } catch (error) {
      //log
      throw error;
    }
  };
}
