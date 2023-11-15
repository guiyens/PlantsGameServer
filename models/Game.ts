import { IGame, StateEnum } from "../Infertaces/IGame";
import { IPlayer } from "../Infertaces/IPlayer";
import { Player } from "./Player";
import { Config } from "../config/gameConfig";
import { ICardDeck } from "../Infertaces/ICardDeck";
import { CardDeck } from "./CardDeck";
import { ECard, EGroup, ICard } from "../Infertaces/ICard";
import { Card } from "./Card";
import { ICrop } from "../Infertaces/ICrop";
import { ILog } from "../Infertaces/ILog";
import { Log } from "./Log";
const { Server } = require("socket.io");
var _ = require("lodash");

export class Game implements IGame {
  players: IPlayer[];
  cardDeck: ICardDeck;
  userActive: string;
  state: StateEnum;
  maxPlayers: number;
  activityLog: Array<ILog>;

  constructor() {
    this.players = [];
    this.cardDeck = new CardDeck();
    this.userActive = "";
    this.state = StateEnum.WAITING;
    this.maxPlayers = Config.maxPlayers;
    this.activityLog = [];
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
    const indexLastPlayer = this.players.length - 1;
    if (indexPlayerActive === indexLastPlayer) {
      this.userActive = this.players[0].socketId;
      return;
    }
    this.userActive = this.players[indexPlayerActive + 1].socketId;
  }

  removePLayer(socketId: string): void {
    if (socketId === this.userActive) {
      this.changeTurn();
    }
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

  dissmis(socketId: string, cardsToDismiss: Array<ICard>, io: any): void {
    const player = this.players.find((player) => player.socketId === socketId)!;
    player.removeCardsToPlayer(cardsToDismiss);
    this.cardDeck.disscard(cardsToDismiss);
    cardsToDismiss.forEach((element) => {
      const nextCardForUser = this.cardDeck.getNextCard(
        this.playSpecial.bind(this),
        io
      );
      player.cards.push(nextCardForUser);
    });
  }

  playSpecial(card: ICard, io: any): void {
    if (card.type === ECard.DISASTER) {
      this.players.forEach((player) => {
        this.cardDeck.disscard(
          player.crop.dictionary["FLOWER"] as Array<ICard>
        );
        (player.crop.dictionary["FLOWER"] as Array<ICard>) = [];
      });
    }
    if (card.type === ECard.RELAXED_SEASON) {
      this.players.forEach((player) => {
        this.cardDeck.disscard(
          player.crop.dictionary["EXTRES"] as Array<ICard>
        );
        (player.crop.dictionary["EXTRES"] as Array<ICard>) = [];
        player.crop.addFlower(
          {} as ICard,
          this.cardDeck.disscard.bind(this.cardDeck),
          this.cardDeck.getFlower.bind(this.cardDeck),
          this.cardDeck.getFruit.bind(this.cardDeck)
        );
      });
    }
    if (card.type === ECard.CROP_ROTATION) {
      let firstPlayerCropOd: ICrop;
      this.players.forEach((player, index) => {
        const isLastPlayer = index === this.players.length - 1;
        const isFirstPlayer = index === 0;
        if (isFirstPlayer) {
          firstPlayerCropOd = _.cloneDeep(player.crop);
        }
        const cropToSet = isLastPlayer
          ? firstPlayerCropOd
          : this.players[index + 1].crop;
        player.crop.dictionary["ROOT"] = cropToSet.dictionary["ROOT"];
        player.crop.dictionary["LEAVE"] = cropToSet.dictionary["LEAVE"];
        player.crop.dictionary["STEM"] = cropToSet.dictionary["STEM"];
        player.crop.dictionary["EXTRES"] = cropToSet.dictionary["EXTRES"];
        player.crop.dictionary["TREATMENT"] = cropToSet.dictionary["TREATMENT"];
        player.crop.dictionary["INDUCTING_CONDITION"] =
          cropToSet.dictionary["INDUCTING_CONDITION"];
        player.crop.dictionary["FLOWER"] = cropToSet.dictionary["FLOWER"];
      });
    }
    this.cardDeck.disscard([card]);
    io.emit("SpecialCardFound", { newGame: this, specialCard: card });
  }
  playWildcard(socketId: string, newCard: ICard, wildcard: ICard): void {
    const player = this.players.find((player) => player.socketId === socketId)!;
    player.removeCardsToPlayer([wildcard]);
    player.addCardToPlayer(newCard);
    this.cardDeck.disscard([wildcard]);
  }

  playCard(socketId: string, card: ICard, io: any): void {
    const player = this.players.find((player) => player.socketId === socketId)!;
    player.removeCardsToPlayer([card]);
    if (
      card.group === EGroup.EXTRES ||
      card.group === EGroup.WILDCARD ||
      card.group === EGroup.SPECIAL
    ) {
      return;
    }

    player.addCardToCrop(
      card,
      this.cardDeck.disscard.bind(this.cardDeck),
      this.cardDeck.getFlower.bind(this.cardDeck),
      this.cardDeck.getFruit.bind(this.cardDeck)
    );

    player.cards.push(
      this.cardDeck.getNextCard(this.playSpecial.bind(this), io)
    );
  }

  playExtressCard(
    socketId: string,
    card: ICard,
    playerToAddExtressId: string,
    io: any
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

    player.cards.push(
      this.cardDeck.getNextCard(this.playSpecial.bind(this), io)
    );
  }

  dealCards(): void {
    // const cardsToDeal = this.cardDeck.cards.filter(
    //   (card: ICard) => card.group !== EGroup.SPECIAL
    // );
    this.players.forEach((player: IPlayer) => {
      for (let index = 0; index < Config.carsdForachPlayer; index++) {
        let randomCardIndex = Math.floor(
          Math.random() * this.cardDeck.cards.length
        );
        let randomCard: ICard = this.cardDeck.cards[randomCardIndex];
        while (randomCard.group === EGroup.SPECIAL) {
          randomCardIndex = Math.floor(
            Math.random() * this.cardDeck.cards.length
          );
          randomCard = this.cardDeck.cards[randomCardIndex];
        }
        player.addCardToPlayer(randomCard);
        // cardsToDeal.splice(randomCardIndex, 1);
        this.cardDeck.cards.splice(randomCardIndex, 1);
      }
    });
    // Falta devolver las especiales al mazo
  }

  startGame(): void {
    this.state = StateEnum.STARTED;
    this.userActive = this.players[Config.initialPlayer].socketId;
    this.dealCards();
  }

  addLog(
    socketId: string,
    cardPlayed: ICard | string,
    playerAffectedId?: string
  ) {
    const player = this.players.find((player) => player.socketId === socketId);
    const playerAffected = this.players.find(
      (player) => player.socketId === playerAffectedId
    );
    const newLog = new Log(
      { socketId: player?.socketId, name: player?.name },
      cardPlayed,
      { socketId: playerAffected?.socketId, name: playerAffected?.name }
    );
    this.activityLog.push(newLog);
  }
}
