import { IPlayer } from "./IPlayer";
import { ICard } from "./ICard.js";

export interface IGame {
  players: Array<IPlayer>;
  cardDeck: Array<ICard>;
  userActive: string;
  state: StateEnum;
}

export enum StateEnum {
  WAITING,
  STARTED,
  FINISHED,
}
