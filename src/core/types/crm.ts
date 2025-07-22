import { IOrder } from "./order";

export interface ICustomer {
  _id?: string;
  name: string;
  order?: IOrder;
  email: string;
  phone: string;
  ordersCount: number;
  orderList?: IOrder[];
  idBusiness?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type CreateCustomerData = Omit<
  ICustomer,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "updatedBy"
>;

export type UpdateCustomerData = Partial<CreateCustomerData>;
