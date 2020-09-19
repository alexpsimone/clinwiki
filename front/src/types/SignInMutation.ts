/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SignInInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SignInMutation
// ====================================================

export interface SignInMutation_signIn_user_reviews {
  __typename: "Review";
  content: string;
  briefTitle: string;
  nctId: string;
}

export interface SignInMutation_signIn_user_reactionsCount {
  __typename: "ExpressionCount";
  name: string;
  count: number;
}

export interface SignInMutation_signIn_user_searchLogs_shortLink_searchParams_sorts {
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

export interface SignInMutation_signIn_user_searchLogs_shortLink_searchParams_aggFilters {
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

export interface SignInMutation_signIn_user_searchLogs_shortLink_searchParams_crowdAggFilters {
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

export interface SignInMutation_signIn_user_searchLogs_shortLink_searchParams {
  __typename: "SearchParams";
  /**
   * A Json version of the SearchQueryInput type
   */
  q: string | null;
  page: number | null;
  pageSize: number | null;
  sorts: SignInMutation_signIn_user_searchLogs_shortLink_searchParams_sorts[] | null;
  aggFilters: SignInMutation_signIn_user_searchLogs_shortLink_searchParams_aggFilters[] | null;
  crowdAggFilters: SignInMutation_signIn_user_searchLogs_shortLink_searchParams_crowdAggFilters[] | null;
}

export interface SignInMutation_signIn_user_searchLogs_shortLink {
  __typename: "ShortLink";
  searchParams: SignInMutation_signIn_user_searchLogs_shortLink_searchParams | null;
}

export interface SignInMutation_signIn_user_searchLogs {
  __typename: "SearchLog";
  id: number;
  createdAt: any;
  shortLink: SignInMutation_signIn_user_searchLogs_shortLink;
}

export interface SignInMutation_signIn_user_reactions_reactionKind {
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

export interface SignInMutation_signIn_user_reactions_study {
  __typename: "Study";
  briefTitle: string;
}

export interface SignInMutation_signIn_user_reactions {
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
  reactionKind: SignInMutation_signIn_user_reactions_reactionKind;
  study: SignInMutation_signIn_user_reactions_study;
  nctId: string;
}

export interface SignInMutation_signIn_user {
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
  reviews: SignInMutation_signIn_user_reviews[];
  reactionsCount: SignInMutation_signIn_user_reactionsCount[] | null;
  searchLogs: SignInMutation_signIn_user_searchLogs[] | null;
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  reactions: SignInMutation_signIn_user_reactions[] | null;
}

export interface SignInMutation_signIn {
  __typename: "SignInPayload";
  /**
   * Json web token
   */
  jwt: string | null;
  /**
   * Signed in user
   */
  user: SignInMutation_signIn_user | null;
}

export interface SignInMutation {
  signIn: SignInMutation_signIn | null;
}

export interface SignInMutationVariables {
  input: SignInInput;
}
