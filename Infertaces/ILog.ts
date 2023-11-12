import { EGroup, ICard } from "./ICard";
import { IPlayer } from "./IPlayer";

export interface ILog {
  player: Partial<IPlayer>;
  date: Date;
  action: EGroup;
  playerAffectted?: Partial<IPlayer>;
  cardPlayed: ICard;
}
