import { IOrderQuery } from "@/common/interfaces";

export const isNotOrderQueryArray = (value: IOrderQuery | IOrderQuery[]): value is IOrderQuery => {
  return !Array.isArray(value);
}