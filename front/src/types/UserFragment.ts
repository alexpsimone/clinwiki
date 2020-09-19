/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserFragment
// ====================================================

export interface UserFragment_reviews {
  __typename: "Review";
  content: string;
  briefTitle: string;
  nctId: string;
}

export interface UserFragment_reactionsCount {
  __typename: "ExpressionCount";
  name: string;
  count: number;
}

export interface UserFragment_searchLogs_shortLink_searchParams_sorts {
  __typename: "Sort";
  /**
   * Column to sort by
   */
  id: string;
  /**
   * Sort in descending order if true
   */
  desc: boolean | null;
}

export interface UserFragment_searchLogs_shortLink_searchParams_aggFilters {
  __typename: "AggFilter";
  /**
   * The field we are filtering on
   */
  field: string;
  /**
   * The values we are filtering for that field
   */
  values: string[];
  /**
   * The start value (inclusive) for a range query
   */
  gte: string | null;
  /**
   * The end value (inclusive) for a range query
   */
  lte: string | null;
  /**
   * Whether to include missing fields
   */
  includeMissingFields: boolean | null;
}

export interface UserFragment_searchLogs_shortLink_searchParams_crowdAggFilters {
  __typename: "AggFilter";
  /**
   * The field we are filtering on
   */
  field: string;
  /**
   * The values we are filtering for that field
   */
  values: string[];
  /**
   * The start value (inclusive) for a range query
   */
  gte: string | null;
  /**
   * The end value (inclusive) for a range query
   */
  lte: string | null;
  /**
   * Whether to include missing fields
   */
  includeMissingFields: boolean | null;
}

export interface UserFragment_searchLogs_shortLink_searchParams {
  __typename: "SearchParams";
  /**
   * A Json version of the SearchQueryInput type
   */
  q: string | null;
  page: number | null;
  pageSize: number | null;
  sorts: UserFragment_searchLogs_shortLink_searchParams_sorts[] | null;
  aggFilters: UserFragment_searchLogs_shortLink_searchParams_aggFilters[] | null;
  crowdAggFilters: UserFragment_searchLogs_shortLink_searchParams_crowdAggFilters[] | null;
}

export interface UserFragment_searchLogs_shortLink {
  __typename: "ShortLink";
  searchParams: UserFragment_searchLogs_shortLink_searchParams | null;
}

export interface UserFragment_searchLogs {
  __typename: "SearchLog";
  id: number;
  createdAt: any;
  shortLink: UserFragment_searchLogs_shortLink;
}

export interface UserFragment_reactions_reactionKind {
  __typename: "ReactionKind";
  /**
   * Id
   */
  id: number;
  /**
   * Name of reaction example is like or dislike
   */
  name: string;
}

export interface UserFragment_reactions_study {
  __typename: "Study";
  briefTitle: string;
}

export interface UserFragment_reactions {
  __typename: "Reaction";
  /**
   * Id
   */
  id: number;
  /**
   * id of reaction kind
   */
  reactionKindId: number;
  /**
   * Type of reaction such as downvote
   */
  reactionKind: UserFragment_reactions_reactionKind;
  study: UserFragment_reactions_study;
  nctId: string;
}

export interface UserFragment {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  /**
   * Email
   */
  email: string;
  /**
   * First name
   */
  firstName: string | null;
  /**
   * Last name
   */
  lastName: string | null;
  /**
   * Default query for user
   */
  defaultQueryString: string | null;
  roles: string[];
  /**
   * Number of reviews the user has done
   */
  reviewCount: number;
  reviews: UserFragment_reviews[];
  reactionsCount: UserFragment_reactionsCount[] | null;
  searchLogs: UserFragment_searchLogs[] | null;
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  reactions: UserFragment_reactions[] | null;
}
