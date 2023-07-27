import { ICard } from "./ICard";

export interface IPlayer {
  socketId: string;
  name: string;
  cards: Array<ICard>;
}
