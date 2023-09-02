import { ICard } from "./ICard";

export interface ICardDeck {
  cards: Array<ICard>;
  flowers: Array<ICard>;
  fruits: Array<ICard>;
  mix(): void;
  getNextCard(): ICard;
  createCards(): void;
  prepareCardDesck(): void;
}
