/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchQueryInput, SortInput, AggFilterInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchPageSearchQueryNoResults
// ====================================================

export interface SearchPageSearchQueryNoResults_crowdAggs_aggs_buckets {
  __typename: "AggBucket";
  key: string;
  keyAsString: string | null;
  docCount: number;
}

export interface SearchPageSearchQueryNoResults_crowdAggs_aggs {
  __typename: "Agg";
  buckets: SearchPageSearchQueryNoResults_crowdAggs_aggs_buckets[];
}

export interface SearchPageSearchQueryNoResults_crowdAggs {
  __typename: "SearchResultSet";
  aggs: SearchPageSearchQueryNoResults_crowdAggs_aggs[] | null;
}

export interface SearchPageSearchQueryNoResults_search_aggs_buckets {
  __typename: "AggBucket";
  key: string;
  docCount: number;
}

export interface SearchPageSearchQueryNoResults_search_aggs {
  __typename: "Agg";
  name: string;
  buckets: SearchPageSearchQueryNoResults_search_aggs_buckets[];
}

export interface SearchPageSearchQueryNoResults_search {
  __typename: "SearchResultSet";
  /**
   * Total results
   */
  recordsTotal: number | null;
  aggs: SearchPageSearchQueryNoResults_search_aggs[] | null;
}

export interface SearchPageSearchQueryNoResults {
  crowdAggs: SearchPageSearchQueryNoResults_crowdAggs;
  /**
   * Searches params by searchHash on server and `params` argument into it
   */
  search: SearchPageSearchQueryNoResults_search | null;
}

export interface SearchPageSearchQueryNoResultsVariables {
  q: SearchQueryInput;
  page?: number | null;
  pageSize?: number | null;
  sorts?: SortInput[] | null;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
}
