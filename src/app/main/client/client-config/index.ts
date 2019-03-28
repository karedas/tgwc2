export interface TgConfigInterface {
  news: boolean,
  layout: {
    extraOutput: boolean,
    characterPanel: boolean,
    zen: boolean,
  }
}

export const tgConfig: TgConfigInterface = {
  news: true,
  layout: {
    extraOutput: true,
    characterPanel: true,
    zen: false
  }
}