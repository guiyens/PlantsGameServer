import { EGroup, ICard } from "./ICard";
import { IPlayer } from "./IPlayer";

export interface ILog {
  player: Partial<IPlayer>;
  date: Date;
  action: EGroup | string;
  playerAffectted?: Partial<IPlayer>;
  cardPlayed: ICard | string;
}
