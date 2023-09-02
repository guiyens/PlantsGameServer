import { ICard } from "./ICard";

export interface IPlayer {
  socketId: string;
  name: string;
  cards: Array<ICard>;
  addCardToPlayer(card: ICard): void;
}
