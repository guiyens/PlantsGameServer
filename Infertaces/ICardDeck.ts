import { ICard } from "./ICard";

export interface ICardDeck {
  cards: Array<ICard>;
  mix(): void;
  getNextCard(): ICard;
  createCards(): void;
}
