import { ICard } from "./ICard";

export interface ICrop {
  root: ICard | undefined;
  leave: ICard | undefined;
  stem: ICard | undefined;
  extres: Array<ICard>;
  treatements: Array<ICard>;
  inductingConditions: Array<ICard>;
  flower: Array<ICard>;
  fruit: Array<ICard>;
}
