export const CardSurfaceType = {
    "BACK": "BACK",
    "FRONT": "FRONT",

} as const;
export type CardSurfaceType = typeof CardSurfaceType[keyof typeof CardSurfaceType];

