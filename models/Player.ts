import { ICard } from "../Infertaces/ICard";
import { IPlayer } from "../Infertaces/IPlayer";

export class Player implements IPlayer {
  socketId: string;
  name: string;
  cards: Array<ICard>;

  constructor(socketId: string, name: string) {
    this.socketId = socketId;
    this.name = name;
    this.cards = [];
  }

  addCardToPlayer(card: ICard): void {
    this.cards.push(card);
  }
}
