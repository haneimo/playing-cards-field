export const Suit = {
    S: 'S',
    H: 'H',
    D: 'D',
    C: 'C',
    J: 'J'
} as const;
export type Suit = typeof Suit[keyof typeof Suit];
