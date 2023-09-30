import { ICard } from "./ICard";
import { ICrop } from "./ICrop";

export interface IPlayer {
  socketId: string;
  name: string;
  cards: Array<ICard>;
  crop: ICrop;
  addCardToPlayer(card: ICard): void;
  removeCardsToPlayer(cardsToDismiss: Array<ICard>): void;
  addCardToCrop(
    card: ICard,
    dismiss: (cardsToDismiss: Array<ICard>) => void,
    getFlower?: () => ICard,
    getFruit?: () => ICard
  ): void;
  isPlayerWinner(): boolean;
  addExtresCardToCrop(
    card: ICard,
    dismiss: (cardsToDismiss: Array<ICard>) => void
  ): void;
}
