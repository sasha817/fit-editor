declare module 'fit-file-parser' {
  export interface FitParserOptions {
    force?: boolean;
    speedUnit?: 'km/h' | 'm/s' | 'mph';
    lengthUnit?: 'km' | 'm' | 'mi';
    temperatureUnit?: 'celcius' | 'fahrenheit' | 'kelvin';
    elapsedRecordField?: boolean;
    mode?: 'list' | 'cascade' | 'both';
  }

  export interface FitActivity {
    sessions?: any[];
    laps?: any[];
    records?: any[];
    events?: any[];
    sport?: string;
  }

  export default class FitParser {
    constructor(options?: FitParserOptions);
    parse(
      content: Buffer | ArrayBuffer,
      callback: (error: Error | null, data: FitActivity) => void
    ): void;
  }
}
