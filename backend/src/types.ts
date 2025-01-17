export interface Champion {
  image: {
    full: string;
  };
  spells: Array<{
    id: string;
  }>;
  passive: {
    image: {
      full: string;
    };
  };
}

export interface Item {
  image: {
    full: string;
  };
}

export interface Summoner {
  image: {
    full: string;
  };
}

export interface RuneSlot {
  icon: string;
  id: number;
}

export interface RunePath {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: Array<{ runes: RuneSlot[] }>;
}
