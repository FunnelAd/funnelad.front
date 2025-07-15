export interface IOrder {
  active: boolean,
  address: string,
  assistant?: string;
  content: string,
  createdAt?: Date;
  createdBy?: string;
  email?: string,
  idBusiness?:string;
  isPending: boolean,
  name: string;
  phone: string,
  status: string
  tokenAssistant: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export type CreateOrderData = Omit<
  IOrder,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "updatedBy"
>;

export type UpdateOrderData = Partial<CreateOrderData>;
