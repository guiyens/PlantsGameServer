import { EGroup, ICard } from "../Infertaces/ICard";
import { ILog } from "../Infertaces/ILog";
import { IPlayer } from "../Infertaces/IPlayer";
import { Crop } from "./Crop";

export class Log implements ILog {
  player: Partial<IPlayer>;
  date: Date;
  action: EGroup;
  playerAffectted: Partial<IPlayer> | undefined;
  cardPlayed: ICard;

  constructor(
    player: Partial<IPlayer>,
    cardPlayed: ICard,
    playerAffected?: Partial<IPlayer>
  ) {
    this.player = player;
    this.date = new Date();
    this.action = cardPlayed.group;
    this.playerAffectted = playerAffected;
    this.cardPlayed = cardPlayed;
  }
}
