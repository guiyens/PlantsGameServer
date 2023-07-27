import { ICard } from "../Infertaces/ICard";
import { IGame, StateEnum } from "../Infertaces/IGame";
import { IPlayer } from "../Infertaces/IPlayer";

export class Game implements IGame {
  players: IPlayer[];
  cardDeck: ICard[];
  userActive: string;
  state: StateEnum;

  constructor() {
    this.players = [];
    this.cardDeck = [];
    this.userActive = "";
    this.state = StateEnum.WAITING;
  }
}
