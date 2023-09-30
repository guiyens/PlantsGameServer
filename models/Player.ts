import { ICard } from "../Infertaces/ICard";
import { ICrop } from "../Infertaces/ICrop";
import { IPlayer } from "../Infertaces/IPlayer";
import { Crop } from "./Crop";

export class Player implements IPlayer {
  socketId: string;
  name: string;
  cards: Array<ICard>;
  crop: ICrop;

  constructor(socketId: string, name: string) {
    this.socketId = socketId;
    this.name = name;
    this.cards = [];
    this.crop = new Crop();
  }

  addCardToPlayer(card: ICard): void {
    this.cards.push(card);
  }

  addCardToCrop(
    card: ICard,
    dismiss: (cardsToDismiss: Array<ICard>) => void,
    getFlower?: () => ICard,
    getFruit?: () => ICard
  ) {
    this.crop.addCardToCrop(card, dismiss, getFlower, getFruit);
  }

  addExtresCardToCrop(
    card: ICard,
    dismiss: (cardsToDismiss: Array<ICard>) => void
  ) {
    this.crop.addExtres(card, dismiss);
  }

  removeCardsToPlayer(cardsToDismiss: Array<ICard>) {
    const cardIds = cardsToDismiss.map((card) => card.id);
    this.cards = this.cards.filter((card) => !cardIds.includes(card.id));
  }

  isPlayerWinner(): boolean {
    return (this.crop.dictionary["FRUIT"] as Array<ICard>).length == 2;
  }
}
