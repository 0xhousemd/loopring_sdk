import * as ethUtil from "ethereumjs-util";
import BN from "bn.js";
import BigNumber from "bignumber.js";
import {
  AmmPoolInfoV3,
  LOOPRING_URLs,
  LoopringMap,
  MarketInfo,
  MarketStatus,
  SEP,
  SoursURL,
  TokenAddress,
  TokenInfo,
  TOKENMAPLIST,
  TokenRelatedInfo,
} from "../defs";

BigNumber.config({
  EXPONENTIAL_AT: 100,
  RANGE: [-100000, 10000000],
  ROUNDING_MODE: 1,
});

/**
 * Returns hex string with '0x' prefix
 * @param input
 * @returns {string}
 */
export function addHexPrefix(input: any) {
  if (typeof input === "string") {
    return input.startsWith("0x") ? input : "0x" + input;
  }
  throw new Error("Unsupported type");
}

/**
 *
 * @param mixed Buffer|number|string (hex string must be with '0x' prefix)
 * @returns {Buffer}
 */
export function toBuffer(mixed: any) {
  if (mixed instanceof Buffer) {
    return mixed;
  } else {
    return ethUtil.toBuffer(mixed);
  }
}

/**
 *
 * @param num number|string (hex string must be with '0x' prefix)
 * @param places number of zeros to pad
 * @returns {Buffer}
 */
export function zeroPad(num: any, places: any) {
  return toBuffer(String(num).padStart(places, "0"));
}

/**
 *
 * @param mixed number | BigNumber |  BN  | Buffer | string | Uint8Array
 * @returns {string}
 */
export function toHex(
  mixed: number | BigNumber | BN | Buffer | string | Uint8Array
) {
  if (
    typeof mixed === "number" ||
    mixed instanceof BigNumber ||
    mixed instanceof BN
  ) {
    return addHexPrefix(mixed.toString(16));
  }

  if (mixed instanceof Buffer || mixed instanceof Uint8Array) {
    return addHexPrefix(mixed.toString("hex"));
  }

  if (typeof mixed === "string") {
    const regex = new RegExp(/^0x[0-9a-fA-F]*$/);
    return regex.test(mixed)
      ? mixed
      : addHexPrefix(toBuffer(mixed).toString("hex"));
  }
  throw new Error("Unsupported type");
}

/**
 *
 * @param mixed number | BigNumber |  BN  | Buffer | string | Uint8Array
 * @returns {number}
 */
export function toNumber(
  mixed: number | BigNumber | BN | Buffer | string | Uint8Array
) {
  if (typeof mixed === "number") {
    return mixed;
  }

  if (mixed instanceof BigNumber || mixed instanceof BN) {
    return mixed.toNumber();
  }

  if (typeof mixed === "string") {
    return Number(mixed);
  }

  if (mixed instanceof Buffer || mixed instanceof Uint8Array) {
    return Number(mixed.toString("hex"));
  }

  throw new Error("Unsupported type");
}

/**
 *
 * @param mixed number | BigNumber |  BN  | Buffer | string | Uint8Array
 * @returns {BigNumber}
 */
export function toBig(
  mixed: number | BigNumber | BN | Buffer | string | Uint8Array
) {
  if (mixed instanceof BigNumber) {
    return mixed;
  }

  if (typeof mixed === "number") {
    return new BigNumber(mixed.toString());
  }

  if (typeof mixed === "string") {
    return new BigNumber(mixed);
  }
  if (mixed instanceof Buffer || mixed instanceof Uint8Array) {
    return new BigNumber(mixed.toString("hex"));
  }

  throw new Error("Unsupported type");
}

/**
 *
 * @param mixed number | BigNumber |  BN  | Buffer | string
 * @returns {BN}
 */
export function toBN(mixed: any) {
  return mixed instanceof BN ? mixed : new BN(toBig(mixed).toString(10), 10);
}

/**
 *
 * @param value number | BigNumber | Buffer | string
 * @returns {BN}
 */
export function fromGWEI(value: any) {
  return new BigNumber(toBig(value).times(1e9).toFixed(0));
}

/**
 *
 * @param value number | BigNumber | Buffer | string
 * @returns {BN}
 */
export function toGWEI(value: any) {
  return toBig(value).div(1e9);
}

/**
 * Returns formatted hex string of a given private key
 * @param mixed Buffer | string | Uint8Array
 * @returns {string}
 */
export function formatKey(mixed: Buffer | string | Uint8Array) {
  if (mixed instanceof Buffer || mixed instanceof Uint8Array) {
    return mixed.toString("hex");
  }

  if (typeof mixed === "string") {
    return mixed.startsWith("0x") ? mixed.slice(2) : mixed;
  }
  throw new Error("Unsupported type");
}

/**
 * Returns hex string of a given address
 * @param mixed Buffer | string |Uint8Array
 * @returns {string}
 */
export function formatAddress(mixed: Buffer | string | Uint8Array) {
  if (mixed instanceof Buffer || mixed instanceof Uint8Array) {
    return ethUtil.toChecksumAddress("0x" + mixed.toString("hex"));
  }

  if (typeof mixed === "string") {
    return ethUtil.toChecksumAddress(
      mixed.startsWith("0x") ? mixed : "0x" + mixed
    );
  }
  throw new Error("Unsupported type");
}

/**
 * Returns hex string without '0x' prefix
 * @param input string
 * @returns {string}
 */
export function clearHexPrefix(input: any) {
  if (typeof input === "string") {
    return input.startsWith("0x") ? input.slice(2) : input;
  }
  throw new Error("Unsupported type");
}

/**
 *
 * @param hex
 * @returns {string}
 */
export function padLeftEven(hex: any) {
  return hex.length % 2 !== 0 ? `0${hex}` : hex;
}

/**
 * Returns symbol of a given kind of currency
 * @param settingsCurrency
 * @returns {*}
 */
export function getDisplaySymbol(settingsCurrency: any) {
  switch (settingsCurrency) {
    case "CNY":
      return "￥";
    case "USD":
      return "$";
    default:
      return "";
  }
}

/**
 * Returns number in string with a given precision
 * @param number number | BigNumber
 * @param precision number
 * @param ceil bool  round up
 * @returns {string}
 */
export function toFixed(number: any, precision: any, ceil: any) {
  precision = precision || 0;
  if (number instanceof BigNumber) {
    const rm = ceil ? 0 : 1;
    return number.toFixed(precision, rm);
  }

  if (typeof number === "number") {
    return ceil
      ? (
          Math.ceil(number * Number("1e" + precision)) /
          Number("1e" + precision)
        ).toFixed(precision)
      : (
          Math.floor(number * Number("1e" + precision)) /
          Number("1e" + precision)
        ).toFixed(precision);
  }

  throw new Error("Unsupported type");
}

export function formatEddsaKey(key: any) {
  const hexKey = clearHexPrefix(key);
  return addHexPrefix(String(hexKey).padStart(64, "0"));
}

/**
 * Returns a number with commas as thousands separators
 * @param number number
 * @returns {*}
 */
export function numberWithCommas(number: any) {
  if (number) {
    number = number.toString().replace(/,/g, "");
    if (isNaN(Number(number))) {
      return "-";
    }
    try {
      const parts = number.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    } catch (err) {
      return "-";
    }
  } else {
    return number;
  }
}

export function sortObjDictionary(obj: {
  [key: string]: any;
}): Map<string, any> {
  const dataToSig: Map<string, any> = new Map();
  if (obj) {
    Reflect.ownKeys(obj)
      .sort((a, b) => a.toString().localeCompare(b.toString()))
      .forEach((key) => {
        dataToSig.set(key.toString(), obj[key.toString()]);
      });
  }
  return dataToSig;
}
export function makeMarket<R>(raw_data: TokenInfo[]): TOKENMAPLIST {
  const coinMap: LoopringMap<{
    icon?: string;
    name: string;
    simpleName: string;
    description?: string;
    company: string;
  }> = {};
  const totalCoinMap: LoopringMap<{
    icon?: string;
    name: string;
    simpleName: string;
    description?: string;
    company: string;
  }> = {};
  const addressIndex: LoopringMap<TokenAddress> = {};
  const idIndex: LoopringMap<string> = {};
  const tokensMap: LoopringMap<TokenInfo> = {};
  if (raw_data instanceof Array) {
    raw_data.forEach((item: TokenInfo) => {
      if (item.symbol.startsWith("LP-")) {
        item.isLpToken = true;
      } else {
        item.isLpToken = false;
      }
      tokensMap[item.symbol] = item;

      const coinInfo = {
        icon: SoursURL + `ethereum/assets/${item.address}/logo.png`,
        name: item.name,
        simpleName: item.symbol,
        description: item.type,
        company: item.name,
      };
      if (!item.symbol.startsWith("LP-")) {
        coinMap[item.symbol] = coinInfo;
      }
      totalCoinMap[item.symbol] = coinInfo;
      addressIndex[item.address.toLowerCase()] = item.symbol;
      idIndex[item.tokenId] = item.symbol;
    });
  }
  return {
    tokensMap,
    coinMap,
    totalCoinMap,
    idIndex,
    addressIndex,
  };
}
export function makeAmmPool<R>(raw_data: any): {
  ammpools: LoopringMap<AmmPoolInfoV3>;
  pairs: LoopringMap<TokenRelatedInfo>;
} {
  const ammpools: LoopringMap<AmmPoolInfoV3> = {};
  const pairs: LoopringMap<TokenRelatedInfo> = {};
  if (raw_data?.pools instanceof Array) {
    raw_data.pools.forEach((item: any) => {
      const market: string = item.market;
      ammpools[market] = item;
      let base = "",
        quote = "";
      const ind = market.indexOf("-");
      const ind2 = market.lastIndexOf("-");
      base = market.substring(ind + 1, ind2);
      quote = market.substring(ind2 + 1, market.length);

      if (!pairs[base]) {
        pairs[base] = {
          tokenId: item.tokens.pooled[0],
          tokenList: [quote],
        };
      } else {
        pairs[base].tokenList = [...pairs[base].tokenList, quote];
      }

      if (!pairs[quote]) {
        pairs[quote] = {
          tokenId: item.tokens.pooled[1],
          tokenList: [base],
        };
      } else {
        pairs[quote].tokenList = [...pairs[quote].tokenList, base];
      }
    });
  }
  return {
    ammpools,
    pairs,
  };
}

export function makeMarkets<R>(
  raw_data: any,
  url: string = LOOPRING_URLs.GET_MARKETS
): {
  markets: LoopringMap<MarketInfo>;
  pairs: LoopringMap<TokenRelatedInfo>;
  tokenArr: string[];
  tokenArrStr: string;
  marketArr: string[];
  marketArrStr: string;
} {
  const markets: LoopringMap<MarketInfo> = {};

  const pairs: LoopringMap<TokenRelatedInfo> = {};

  const isMix = url === LOOPRING_URLs.GET_MIX_MARKETS;

  if (raw_data?.markets instanceof Array) {
    raw_data.markets.forEach((item: any) => {
      const marketInfo: MarketInfo = {
        baseTokenId: item.baseTokenId,
        enabled: item.enabled,
        market: item.market,
        orderbookAggLevels: item.orderbookAggLevels,
        precisionForPrice: item.precisionForPrice,
        quoteTokenId: item.quoteTokenId,
      };

      if (isMix) {
        marketInfo.status = item.status as MarketStatus;
        marketInfo.isSwapEnabled =
          marketInfo.status === MarketStatus.ALL ||
          marketInfo.status === MarketStatus.AMM;
        marketInfo.createdAt = parseInt(item.createdAt);
      }

      markets[item.market] = marketInfo;

      if (item.enabled) {
        const market: string = item.market;
        const ind = market.indexOf("-");
        const base = market.substring(0, ind);
        const quote = market.substring(ind + 1, market.length);

        if (!pairs[base]) {
          pairs[base] = {
            tokenId: item.baseTokenId,
            tokenList: [quote],
          };
        } else {
          pairs[base].tokenList = [...pairs[base].tokenList, quote];
        }

        if (!pairs[quote]) {
          pairs[quote] = {
            tokenId: item.quoteTokenId,
            tokenList: [base],
          };
        } else {
          pairs[quote].tokenList = [...pairs[quote].tokenList, base];
        }
      }
    });
  }

  const marketArr: string[] = Reflect.ownKeys(markets) as string[];

  const tokenArr: string[] = Reflect.ownKeys(pairs) as string[];

  return {
    markets,
    pairs,
    tokenArr,
    tokenArrStr: tokenArr.join(SEP),
    marketArr,
    marketArrStr: marketArr.join(SEP),
  };
}
