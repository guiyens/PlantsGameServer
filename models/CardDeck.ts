import { ICard, ECard, EGroup } from "../Infertaces/ICard";
import { ICardDeck } from "../Infertaces/ICardDeck";
import { CardsConfig } from "../config/cards";
import { Card } from "./Card";

const cardsConfig: Record<
  string,
  { url: string; group: EGroup; amount: number; name: string }
> = CardsConfig;

export class CardDeck implements ICardDeck {
  cards: ICard[];

  constructor() {
    this.cards = [];
    this.createCards();
  }

  mix(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const k = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = k;
    }
  }
  getNextCard(): ICard {
    const firstCard = 0;
    const cardToReturn = { ...this.cards[firstCard] };
    this.cards.splice(0, 1);
    return cardToReturn;
  }
  createCards(): void {
    for (const value in ECard) {
      for (let i = 0; i < cardsConfig[value].amount; i++) {
        this.cards.push(
          new Card(
            `${value}-${i + 1}`,
            value as ECard,
            cardsConfig[value].url,
            cardsConfig[value].group
          )
        );
      }
    }
  }
}
