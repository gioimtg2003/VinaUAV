interface Palellte {
  primary: string;
  background: string;
  surface: string;
  border: string;
  textMain: string;
  textMuted: string;
  accent: string;
}
type ThemeID = string;

export const palelltes: Record<ThemeID, Palellte> = {
  "1": {
    primary: "#F6F8FF",
    background: "#272D2D",
    surface: "#29282D", //background sidebar, card, panel, ...
    border: "#50514F",
    textMain: "#F6F8FF",
    textMuted: "#F7F7FF", // color for metric, description, ...
    accent: "", // warning low battery & error
  },
};
