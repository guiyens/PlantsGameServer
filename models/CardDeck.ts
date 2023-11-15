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
  flowers: ICard[];
  fruits: ICard[];
  discarded: ICard[];

  constructor() {
    this.cards = [];
    this.flowers = [];
    this.fruits = [];
    this.discarded = [];
    this.createCards();
    this.prepareCardDesck();
    this.mix();
  }

  mix(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const k = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = k;
    }
  }

  getNextCard(playSpecial: (card: ICard, io: any) => void, io: any): ICard {
    let cardToReturn: ICard;
    if (this.cards.length === 0) {
      this.cards = [...this.discarded];
      this.discarded = [];
    }
    let firstCard = this.cards[0];
    if (firstCard.group === EGroup.SPECIAL) {
      playSpecial(firstCard, io);
      //devolvemos la siguiente carta del mazo pero si es especial cogemos la siguiente
      if (this.cards[1].group === EGroup.SPECIAL) {
        cardToReturn = { ...this.cards[2] };
        this.cards.push(this.cards[1]);
        this.cards.splice(0, 2);
      } else {
        cardToReturn = { ...this.cards[1] };
        this.cards.splice(0, 2);
      }
    } else {
      cardToReturn = { ...firstCard };
      this.cards.splice(0, 1);
    }

    return cardToReturn;
  }
  getFlower(): ICard {
    let firstCard = 0;
    let cardToReturn = { ...this.flowers[firstCard] };
    this.flowers.splice(0, 1);

    return cardToReturn;
  }
  getFruit(): ICard {
    let firstCard = 0;
    let cardToReturn = { ...this.fruits[firstCard] };
    this.fruits.splice(0, 1);

    return cardToReturn;
  }
  createCards(): void {
    for (const value in ECard) {
      // No meto en el mazo las cartas especiales
      // Cuando quiera jugar con ellas hayq ue borrar este codigo
      // if (
      //   value === "DISASTER" ||
      //   value === "RELAXED_SEASON" ||
      //   value === "CROP_ROTATION"
      // ) {
      //   continue;
      // }
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

  prepareCardDesck() {
    this.flowers = this.cards.filter(
      (card: ICard) => card.type === ECard.FLOWER
    );
    this.fruits = this.cards.filter((card: ICard) => card.type === ECard.FRUIT);
    this.cards = this.cards.filter(
      (card: ICard) => card.type !== ECard.FRUIT && card.type !== ECard.FLOWER
    );
  }

  disscard(cardsToDismiss: Array<ICard>): void {
    // Nunca mando a descartes las cartas que se han creado por un comodin
    // Las eliminimo de los descartes
    const realCards = cardsToDismiss.filter((card) => !card.isWildCardOrigin);
    realCards.forEach((card) => (card.isSelected = false));
    // añado los descartes que no son flores a descartes
    const cardsToDismissOthers = cardsToDismiss.filter(
      (card) => card.type !== ECard.FLOWER && card.type !== ECard.FRUIT
    );
    this.discarded = this.discarded.concat(cardsToDismissOthers);
    // añado los descartes que son flores a las flores
    const cardsToDismissFlowers = cardsToDismiss.filter(
      (card) => card.type === ECard.FLOWER
    );
    this.flowers = this.flowers.concat(cardsToDismissFlowers);
    //Los frutos no hace falta descartarlos porque el juego temina con 2 frutos y nunca llega a producirse ese caso
  }
}
