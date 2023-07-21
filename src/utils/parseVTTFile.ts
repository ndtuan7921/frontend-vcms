import * as webvtt from "node-webvtt";

export function parseWebVtt(webvttContent: string) {
  const { cues } = webvtt.parse(webvttContent, (err, data) => {});

  return cues.map((cue: any) => {
    const [name, description, price, imgURL] = cue.text.split("\n");
    return { startTime: cue.start, name, description, price, imgURL };
  });
}
