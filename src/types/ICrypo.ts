export interface ICrypto {
    price:number;
    name: string;
    symbol: string;
    last_trade_at?: string;
    percent_change_btc_last_24_hours?:number;
    volume_last_24_hours?:number;
    price_btc?:number;
    price_usd?:number
}


export interface ICurrencyDetails {
    name: string
    symbol: string
    last_trade_at: string
    percent_change_btc_last_24_hours: string
    volume_last_24_hours: string
    price_btc: string
    price_usd: string
  }