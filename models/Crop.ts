import { ECard, EGroup, ICard, tratamentVsExtres } from "../Infertaces/ICard";
import { ICrop } from "../Infertaces/ICrop";
import IDictionary from "../Infertaces/IDictionary";
import { Card } from "./Card";

export class Crop implements ICrop {
  dictionary: IDictionary<ICard>;

  constructor() {
    this.dictionary = {};
    this.dictionary["ROOT"] = undefined;
    this.dictionary["LEAVE"] = undefined;
    this.dictionary["STEM"] = undefined;
    this.dictionary["EXTRES"] = [];
    this.dictionary["TREATMENT"] = [];
    this.dictionary["INDUCTING_CONDITION"] = [];
    this.dictionary["FLOWER"] = [];
    this.dictionary["FRUIT"] = [];
  }

  addCardToCrop(
    card: ICard,
    dismiss: (cardsToDismiss: Array<ICard>) => void,
    getFlower: () => ICard,
    getFruit: () => ICard
  ) {
    // Limpiamos el id
    const idWithNoNumber: string = card.id.substring(0, card.id.indexOf("-"));
    if (
      card.group === EGroup.WILDCARD ||
      card.group === EGroup.SPECIAL ||
      card.group === EGroup.EXTRES
    ) {
      return;
    }
    if (card.group === EGroup.VEGETETIVE_ORGAN) {
      if (!this.dictionary[card.type]) {
        this.dictionary[card.type] = card;
        this.addFlower(card, dismiss, getFlower, getFruit);
      }
      return;
    }
    if (card.group === EGroup.TREATMENT) {
      // Buscamos el treatement por si ya esta añadido
      const treatementFound = (
        this.dictionary["TREATMENT"] as Array<ICard>
      ).find((treatement) => treatement.id.includes(idWithNoNumber));
      if (!!treatementFound) {
        // Si ya esta añadido retornamos
        return;
      }
      // Conseguimos el extres vinculado al treatement
      const extresIdToCheck = tratamentVsExtres[idWithNoNumber];
      // Busamos el extress
      const extresFound =
        extresIdToCheck.indexOf(" ") !== -1
          ? (this.dictionary["EXTRES"] as Array<ICard>).find(
              (extres) =>
                extres.id.includes(extresIdToCheck.split(" ")[0]) ||
                extres.id.includes(extresIdToCheck.split(" ")[1])
            )
          : (this.dictionary["EXTRES"] as Array<ICard>).find((extres) =>
              extres.id.includes(extresIdToCheck)
            );
      if (!!extresFound) {
        // Si lo encontramos
        if (extresIdToCheck.indexOf(" ") !== -1) {
          const extresIdsToCheck = extresIdToCheck.split(" ");
          // Quitamos la carta de extres encontrada del crop
          //************ BUG - En este filter esta el bug de que cuando hay dos tipos de extres de bugs y se aplica una carta de insecticida se eliminan los dos y no solo uno **********/
          this.dictionary["EXTRES"] = (
            this.dictionary["EXTRES"] as Array<ICard>
          ).filter(
            (extress) =>
              !extress.id.includes(extresIdsToCheck[0]) &&
              !extress.id.includes(extresIdsToCheck[1])
          );
        } else {
          // Quitamos la carta de extres encontrada del crop
          this.dictionary["EXTRES"] = (
            this.dictionary["EXTRES"] as Array<ICard>
          ).filter((extress) => !extress.id.includes(extresIdToCheck));
        }
        // Descartamos la carta de extress encontrada y la carta de treatement jugada por el usuario
        dismiss([extresFound, card]);
        // Llamamos para añadir una flor por si acabo esten las condiciones necesarias para florecer pero habia un extres que lo impedia y que acabamos de eliminar
        this.addFlower(card, dismiss, getFlower, getFruit);
        return;
      }
      // Si no lo encontradmos, añadimos el tratamiento a su sitio
      (this.dictionary["TREATMENT"]! as Array<ICard>).push(card);
      return;
    }

    if (card.group === EGroup.INDUCTING_CONDITION) {
      // Si no tenemos ninguna carta de INDUCTING_CONDITION en el crop
      if (
        (this.dictionary["INDUCTING_CONDITION"] as Array<ICard>).length === 0
      ) {
        // añadimos la INDUCTING_CONDITION a su sitio
        (this.dictionary["INDUCTING_CONDITION"] as Array<ICard>).push(card);
        // Si la planta esta completa y no tiene ningun extress
        return;
      }

      // Si ya tenemos una carta de INDUCTING_CONDITION en el crop y
      // la carta que ha jugado el usuario es de un tipo de INDUCTING_CONDITION diferete a la que ya tiene
      if (
        (this.dictionary["INDUCTING_CONDITION"] as Array<ICard>).length === 1 &&
        !(
          this.dictionary["INDUCTING_CONDITION"] as Array<ICard>
        )[0].id.includes(idWithNoNumber)
      ) {
        // añadimos la INDUCTING_CONDITION a su sitio
        (this.dictionary["INDUCTING_CONDITION"] as Array<ICard>).push(card);
        this.addFlower(card, dismiss, getFlower, getFruit);
      }
      return;
    }
  }

  addExtres(
    card: ICard,
    dismiss: (cardsToDismiss: Array<ICard>) => void
  ): void {
    if (card.group !== EGroup.EXTRES) {
      return;
    }
    const idWithNoNumber2: string = card.id.substring(0, card.id.indexOf("-"));
    // Buscamos el extres por si ya esta añadido
    const extresFound = (this.dictionary["EXTRES"] as Array<ICard>).find(
      (extres) => extres.id.includes(idWithNoNumber2)
    );
    if (!!extresFound) {
      // Si ya esta añadido retornamos
      return;
    }
    // Limpiamos el id
    const idWithNoNumber: string = card.id.substring(0, card.id.indexOf("-"));
    // Conseguimos el treatement vinculado al extres
    const treatementIdToCheck = tratamentVsExtres[idWithNoNumber];
    // Busamos el treatement
    const treatementFound = (this.dictionary["TREATMENT"] as Array<ICard>).find(
      (treatment) => treatment.id.includes(treatementIdToCheck)
    );
    if (!!treatementFound) {
      // Si lo encontramos
      // Quitamos la carta de treatement encontrada del crop
      this.dictionary["TREATMENT"] = (
        this.dictionary["TREATMENT"] as Array<ICard>
      ).filter((treatment) => !treatment.id.includes(treatementIdToCheck));
      // Descartamos la carta de treatement encontrada y la carta de extres jugada por el usuario
      dismiss([treatementFound, card]);
      return;
    }
    // Si no lo encontradmos, añadimos el extres a su sitio
    (this.dictionary["EXTRES"]! as Array<ICard>).push(card);
  }

  addFlower(
    card: ICard,
    dismiss: (cardsToDismiss: Array<ICard>) => void,
    getFlower: () => ICard,
    getFruit: () => ICard
  ) {
    // Si la planta esta completa y
    // si tiene dos o mas INDUCTING_CONDITION
    // y no tiene ningun extress
    if (
      !!this.dictionary["ROOT"] &&
      !!this.dictionary["LEAVE"] &&
      !!this.dictionary["STEM"] &&
      (this.dictionary["EXTRES"] as Array<ICard>).length === 0 &&
      (this.dictionary["INDUCTING_CONDITION"] as Array<ICard>).length >= 2
    ) {
      // Añadimos una flor
      (this.dictionary["FLOWER"] as Array<ICard>).push(getFlower());

      // Descartamos las cartas de INDUCTING_CONDITION en el crop y la carta que jugo el usuario
      dismiss([...(this.dictionary["INDUCTING_CONDITION"] as Array<ICard>)]);

      // Limpiamos las INDUCTING_CONDITION del crop.
      this.dictionary["INDUCTING_CONDITION"] = [];

      // Si hay dos flores añadimos un fruto
      this.addFruit(dismiss, getFruit);
    }
  }

  addFruit(
    dismiss: (cardsToDismiss: Array<ICard>) => void,
    getFruit: () => ICard
  ) {
    if ((this.dictionary["FLOWER"] as Array<ICard>).length >= 2) {
      (this.dictionary["FRUIT"] as Array<ICard>).push(getFruit());
      dismiss([...(this.dictionary["FLOWER"] as Array<ICard>)]);
      this.dictionary["FLOWER"] = [];
    }
  }
}
