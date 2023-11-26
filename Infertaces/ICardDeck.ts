import { ICard } from "./ICard";

export interface ICardDeck {
  cards: Array<ICard>;
  flowers: Array<ICard>;
  fruits: Array<ICard>;
  discarded: Array<ICard>;
  mix(): void;
  getNextCard(playSpecial: (card: ICard, io: any) => void, io: any): ICard;
  createCards(): void;
  prepareCardDesck(): void;
  disscard(cardsToDismiss: Array<ICard>): void;
  getFruit(): ICard;
  getFlower(): ICard;
  addSpecialCards(): void;
}
