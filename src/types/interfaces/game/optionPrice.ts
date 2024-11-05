export interface IOptionPrice {
    [x: string]: IStrikePrice
}

export interface IStrikePrice {
    [x: string]: IOptionCallPut
}

export interface IOptionCallPut {
    [x: string]: {
        call: number,
        put: number
    }
}
