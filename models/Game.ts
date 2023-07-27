import { IGame, StateEnum } from "../Infertaces/IGame";
import { IPlayer } from "../Infertaces/IPlayer";
import { Player } from "./Player";
import { Config } from "../config/gameConfig";
import { ICardDeck } from "../Infertaces/ICardDeck";
import { CardDeck } from "./CardDeck";

export class Game implements IGame {
  players: IPlayer[];
  cardDeck: ICardDeck;
  userActive: string;
  state: StateEnum;

  constructor() {
    this.players = [];
    this.cardDeck = new CardDeck();
    this.userActive = "";
    this.state = StateEnum.WAITING;
  }

  changeTurn(): void {
    const indexPlayerActive = this.players.findIndex(
      (player) => player.socketId === this.userActive
    );
    const indexLastPlayer = Config.maxPlayers - 1;
    if (indexPlayerActive === indexLastPlayer) {
      this.userActive = this.players[0].socketId;
      return;
    }
    this.userActive = this.players[indexPlayerActive + 1].socketId;
  }

  removePLayer(socketId: string): void {
    this.players = this.players.filter(
      (player) => player.socketId !== socketId
    );
  }

  isFullGame(): boolean {
    return this.players.length >= Config.maxPlayers;
  }

  isPlayerAlreadyAdded(name: string): boolean {
    return this.players.some((player: IPlayer) => player.name === name);
  }

  addPlayer(player: Player): void {
    this.players.push(player);
    console.log("A userAdded: " + player.name);

    if (this.isFullGame()) {
      this.startGame();
    }
  }

  startGame(): void {
    this.state = StateEnum.STARTED;
    this.userActive = this.players[Config.initialPlayer].socketId;
  }
}
