import { ECard, EGroup, ICard } from "../Infertaces/ICard";

export class Card implements ICard {
  id: string;
  type: ECard;
  image: string;
  group: EGroup;

  constructor(id: string, type: ECard, image: string, group: EGroup) {
    this.id = id;
    this.type = type;
    this.image = image;
    this.group = group;
  }
}
