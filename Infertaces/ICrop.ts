import { ICard } from "./ICard";
import IDictionary from "./IDictionary";

export interface ICrop {
  dictionary: IDictionary<ICard>;
  addCardToCrop(
    card: ICard,
    dismiss: (cardsToDismiss: Array<ICard>) => void,
    getFlower?: () => ICard,
    getFruit?: () => ICard
  ): void;
  addExtres(card: ICard, dismiss: (cardsToDismiss: Array<ICard>) => void): void;
}
