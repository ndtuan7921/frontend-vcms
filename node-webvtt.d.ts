declare module "node-webvtt" {
  export function parse(
    vttString: string,
    callback: (error: Error | null, captions: Caption[]) => void
  ): void;

  export interface Caption {
    id: number;
    start: number;
    end: number;
    text: string;
    styles: Record<string, string>;
    voices: Voice[];
  }

  export interface Voice {
    uri: string;
    language: string;
  }
}
