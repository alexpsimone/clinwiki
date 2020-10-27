type IslandConstructor = (
  attributes: Record<string, string>,
  context?: object,
  parent?: any
) => JSX.Element;

export interface Island {
  construct: IslandConstructor;
}

// Archipelago?
export type IslandCollection = Record<string, Island>;

export function makeIsland(construct: IslandConstructor) {
  return { construct } as Island;
}
