import { ICard } from "../Infertaces/ICard";
import { ICrop } from "../Infertaces/ICrop";

export class Crop implements ICrop {
  root: ICard | undefined;
  leave: ICard | undefined;
  stem: ICard | undefined;
  extres: ICard[];
  treatements: ICard[];
  inductingConditions: ICard[];
  flower: ICard[];
  fruit: ICard[];
  constructor() {
    this.root = undefined;
    this.leave = undefined;
    this.stem = undefined;
    this.extres = [];
    this.treatements = [];
    this.inductingConditions = [];
    this.flower = [];
    this.fruit = [];
  }
}
