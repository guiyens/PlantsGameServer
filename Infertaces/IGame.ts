import { IPlayer } from "./IPlayer";
import { ICard } from "./ICard.js";
import { Player } from "../models/Player";
import { ICardDeck } from "./ICardDeck";

export interface IGame {
  players: Array<IPlayer>;
  cardDeck: ICardDeck;
  userActive: string;
  state: StateEnum;
  changeTurn(): void;
  removePLayer(socketId: string): void;
  isFullGame(): boolean;
  isPlayerAlreadyAdded(name: string): boolean;
  addPlayer(player: Player): void;
  startGame(): void;
  isOnePlayer(): boolean;
  isEmptyPlayers(): boolean;
}

export enum StateEnum {
  WAITING,
  STARTED,
  FINISHED,
}
