import { IGame, StateEnum } from "../Infertaces/IGame";
import { IPlayer } from "../Infertaces/IPlayer";
import { Player } from "./Player";
import { Config } from "../config/gameConfig";
import { ICardDeck } from "../Infertaces/ICardDeck";
import { CardDeck } from "./CardDeck";
import { EGroup, ICard } from "../Infertaces/ICard";
import { Card } from "./Card";

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
  endGame(): void {
    throw new Error("Method not implemented.");
  }
  initGame(): void {
    throw new Error("Method not implemented.");
  }

  isOnePlayer(): boolean {
    return this.players.length === 1;
  }

  isEmptyPlayers(): boolean {
    return this.players.length === 0;
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

  addPlayer(player: IPlayer): void {
    this.players.push(player);
    if (this.isFullGame()) {
      this.startGame();
    }
  }

  dissmis(socketId: string, cardsToDismiss: Array<ICard>): void {
    const player = this.players.find((player) => player.socketId === socketId)!;
    player.removeCardsToPlayer(cardsToDismiss);
    this.cardDeck.disscard(cardsToDismiss);
    cardsToDismiss.forEach((element) => {
      const nextCardForUser = this.cardDeck.getNextCard();
      player.cards.push(nextCardForUser);
    });
  }

  playSpecial(card: ICard): void {
    console.log("Special card Played");
  }
  playWildcard(socketId: string, newCard: ICard, wildcard: ICard): void {
    const player = this.players.find((player) => player.socketId === socketId)!;
    player.removeCardsToPlayer([wildcard]);
    player.addCardToPlayer(newCard);
    this.cardDeck.disscard([wildcard]);
  }

  playCard(socketId: string, card: ICard): void {
    const player = this.players.find((player) => player.socketId === socketId)!;
    player.removeCardsToPlayer([card]);
    if (card.group === EGroup.EXTRES || card.group === EGroup.WILDCARD) {
      return;
    }
    if (card.group === EGroup.SPECIAL) {
      this.playSpecial(card);
    }
    if (card.group !== EGroup.SPECIAL) {
      player.addCardToCrop(
        card,
        this.cardDeck.disscard.bind(this.cardDeck),
        this.cardDeck.getFlower.bind(this.cardDeck),
        this.cardDeck.getFruit.bind(this.cardDeck)
      );
    }
    player.cards.push(this.cardDeck.getNextCard());
  }

  playExtressCard(
    socketId: string,
    card: ICard,
    playerToAddExtressId: string
  ): void {
    if (card.group !== EGroup.EXTRES) {
      return;
    }
    const player = this.players.find((player) => player.socketId === socketId)!;
    const playerToAddExtres = this.players.find(
      (player) => player.socketId === playerToAddExtressId
    )!;
    player.removeCardsToPlayer([card]);
    playerToAddExtres.addExtresCardToCrop(
      card,
      this.cardDeck.disscard.bind(this.cardDeck)
    );

    player.cards.push(this.cardDeck.getNextCard());
  }

  dealCards(): void {
    const cardsToDeal = this.cardDeck.cards.filter(
      (card: ICard) => card.group !== EGroup.SPECIAL
    );
    this.players.forEach((player: IPlayer) => {
      for (let index = 0; index < Config.carsdForachPlayer; index++) {
        const randomCard = Math.floor(Math.random() * cardsToDeal.length);
        player.addCardToPlayer(this.cardDeck.cards[randomCard]);
        cardsToDeal.splice(randomCard, 1);
        this.cardDeck.cards.splice(randomCard, 1);
      }
    });
    // Falta devolver las especiales al mazo
  }

  startGame(): void {
    this.state = StateEnum.STARTED;
    this.userActive = this.players[Config.initialPlayer].socketId;
    this.dealCards();
  }
}
