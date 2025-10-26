// Minimal shim for @garmin/fitsdk to satisfy the TypeScript compiler.
// Only declares core classes and methods needed in your project.

declare module '@garmin/fitsdk' {
  export class Stream {
    static fromBuffer(buffer: Buffer): any;
    static fromByteArray(bytes: number[]): any;
  }

  export class Decoder {
    constructor(stream: any);
    static isFIT(stream: any): boolean;
    isFIT(): boolean;
    checkIntegrity(): boolean;
    read(options?: any): { messages: any; errors: any };
  }

  export class Encoder {
    constructor(options?: any);
    encode(messages: any): Uint8Array;
    close(): Uint8Array;
  }

  export class Messages {
    constructor(...args: any[]);
  }

  export class Profile {
    static MesgNum: Record<string, number>;
  }

  export class Utils {
    static FIT_EPOCH_MS: number;
    static convertDateTimeToDate(fitDateTime: number): Date;
  }
}
