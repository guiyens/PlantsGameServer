import { EGroup, ICard } from "../Infertaces/ICard";
import { ILog } from "../Infertaces/ILog";
import { IPlayer } from "../Infertaces/IPlayer";
import { Crop } from "./Crop";

export class Log implements ILog {
  player: Partial<IPlayer>;
  date: Date;
  action: EGroup | string;
  playerAffectted: Partial<IPlayer> | undefined;
  cardPlayed: ICard | string;

  constructor(
    player: Partial<IPlayer>,
    cardPlayed: ICard | string,
    playerAffected?: Partial<IPlayer>
  ) {
    this.player = player;
    this.date = new Date();
    this.action =
      typeof cardPlayed === "string" ? cardPlayed : cardPlayed.group;
    this.playerAffectted = playerAffected;
    this.cardPlayed = cardPlayed;
  }
}
