export interface ICard {
  id: string;
  type: ECard;
  image: string;
  group: EGroup;
  isSelected?: boolean;
  isWildCardOrigin?: boolean;
}

export enum ECard {
  ROOT = "ROOT",
  STEM = "STEM",
  LEAVE = "LEAVE",
  PHOTOPERIOD = "PHOTOPERIOD",
  COLD = "COLD",
  MINERAL_DEFICIENCIES = "MINERAL_DEFICIENCIES",
  DROGHT = "DROGHT",
  WEED = "WEED",
  DEFOLIATORS_BUGS = "DEFOLIATORS_BUGS",
  APHIDS_BUGS = "APHIDS_BUGS",
  NEMATODE = "NEMATODE",
  FUNGUS = "FUNGUS",
  FERTILIZER = "FERTILIZER",
  WATER = "WATER",
  HERBICIDE = "HERBICIDE",
  INSECTICIDE = "INSECTICIDE",
  NEMATICIDE = "NEMATICIDE",
  FUNGICIDE = "FUNGICIDE",
  WILDCARD = "WILDCARD",
  CROP_ROTATION = "CROP_ROTATION",
  DISASTER = "DISASTER",
  RELAXED_SEASON = "RELAXED_SEASON",
  FLOWER = "FLOWER",
  FRUIT = "FRUIT",
}
export enum EGroup {
  VEGETETIVE_ORGAN = "VEGETETIVE_ORGAN",
  INDUCTING_CONDITION = "INDUCTING_CONDITION",
  EXTRES = "EXTRES",
  TREATMENT = "TREATMENT",
  WILDCARD = "WILDCARD",
  SPECIAL = "SPECIAL",
  FLOWER = "FLOWER",
  FRUIT = "FRUIT",
}

export const tratamentVsExtres: Record<string, string> = {
  FERTILIZER: "MINERAL_DEFICIENCIES",
  WATER: "DROGHT",
  HERBICIDE: "WEED",
  INSECTICIDE: "APHIDS_BUGS DEFOLIATORS_BUGS",
  NEMATICIDE: "NEMATODE",
  FUNGICIDE: "FUNGUS",
  MINERAL_DEFICIENCIES: "ERTILIZER",
  DROGHT: "WATER",
  WEED: "HERBICIDE",
  APHIDS_BUGS: "INSECTICIDE",
  DEFOLIATORS_BUGS: "INSECTICIDE",
  NEMATODE: "NEMATICIDE",
  FUNGUS: "FUNGICIDE",
};
