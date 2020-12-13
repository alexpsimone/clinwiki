import {
  Fragment,
  FragmentCollection,
  FragmentName,
} from './MailMergeFragment';

type IslandConstructor<TContext, TEvent> = (args: {
  // Attributes defined in the template
  attributes: Record<string, string>;
  // A way to communicate intentions out of the MailMerge
  dispatch: (event: TEvent) => void;
  // The graphql query result
  context: TContext;
  // The children as written in the template
  children?: JSX.Element[];
  // The parent element
  parent: object;
  // If this returns true don't invalidate the element tree
  useCache: (old: TContext, updated: TContext) => boolean;
}) => JSX.Element;

export interface Island<TContext, TEvent> {
  // fragment needed to populate this island's context (merges child islands with children)
  fragments: FragmentCollection;
  construct: IslandConstructor<TContext, TEvent>;
}

// Archipelago?
export type IslandCollection<TContext = unknown, TEvent = never> = Record<
  string,
  Island<TContext, TEvent>
>;

export function makeIsland<TContext, TEvent = never>(
  construct: IslandConstructor<TContext, TEvent>,
  fragments?: Record<string, Fragment>
) {
  return { construct, fragments: fragments ?? {} } as Island<TContext, TEvent>;
}
