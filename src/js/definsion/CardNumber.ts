export const CardNumber = {
    A: 'A',
    N2: '2',
    N3: '3',
    N4: '4',
    N5: '5',
    N6: '6',
    N7: '7',
    N8: '8',
    N9: '9',
    N10: '10',
    J: 'J',
    Q: 'Q',
    K: 'K'
} as const;
export type CardNumber = typeof CardNumber[keyof typeof CardNumber];

