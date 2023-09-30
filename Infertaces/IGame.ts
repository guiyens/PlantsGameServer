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
  dissmis(socketId: string, cardsToDismiss: Array<ICard>): void;
  playCard(socketId: string, card: ICard): void;
  playSpecial(card: ICard): void;
  playWildcard(socketId: string, newCard: ICard, wildcard: ICard): void;
  playExtressCard(
    socketId: string,
    card: ICard,
    playerToAddExtressId: string
  ): void;
}

export enum StateEnum {
  WAITING,
  STARTED,
  FINISHED,
}
