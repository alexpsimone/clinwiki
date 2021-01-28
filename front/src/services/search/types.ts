import {SearchPageAggsQuery} from './model/SearchPageAggsQuery';
import {SearchPageSearchQuery} from './model/SearchPageSearchQuery';
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';
import { SearchPageAggBucketsQuery } from 'types/SearchPageAggBucketsQuery';
import { SearchPageCrowdAggBucketsQuery } from 'types/SearchPageCrowdAggBucketsQuery';

export const FETCH_SEARCH_PAGE_AGGS_SEND = 'FETCH_SEARCH_PAGE_AGGS_SEND';
export const FETCH_SEARCH_PAGE_AGGS_SUCCESS = 'FETCH_SEARCH_PAGE_AGGS_SUCCESS';
export const FETCH_SEARCH_PAGE_AGGS_ERROR = 'FETCH_SEARCH_PAGE_AGGS_ERROR';

export const FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND = 'FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND';
export const FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS = 'FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS';
export const FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR = 'FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR';

export const FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND = 'FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND';
export const FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS = 'FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS';
export const FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR = 'FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR';

export const FETCH_SEARCH_PARAMS_SEND = 'FETCH_SEARCH_PARAMS_SEND';
export const FETCH_SEARCH_PARAMS_SUCCESS = 'FETCH_SEARCH_PARAMS_SUCCESS';
export const FETCH_SEARCH_PARAMS_ERROR = 'FETCH_SEARCH_PARAMS_ERROR';

export const UPDATE_SEARCH_PARAMS_SEND = 'UPDATE_SEARCH_PARAMS_SEND';
export const UPDATE_SEARCH_PARAMS_SUCCESS = 'UPDATE_SEARCH_PARAMS_SUCCESS';
export const UPDATE_SEARCH_PARAMS_ERROR = 'UPDATE_SEARCH_PARAMS_ERROR';

export const FETCH_SEARCH_STUDIES_SEND = 'FETCH_SEARCH_STUDIES_SEND';
export const FETCH_SEARCH_STUDIES_SUCCESS = 'FETCH_SEARCH_STUDIES_SUCCESS';
export const FETCH_SEARCH_STUDIES_ERROR = 'FETCH_SEARCH_STUDIES_ERROR';

export const FETCH_SEARCH_AUTOSUGGEST_SEND = 'FETCH_SEARCH_AUTOSUGGEST_SEND';
export const FETCH_SEARCH_AUTOSUGGEST_SUCCESS = 'FETCH_SEARCH_AUTOSUGGEST_SUCCESS';
export const FETCH_SEARCH_AUTOSUGGEST_ERROR = 'FETCH_SEARCH_AUTOSUGGEST_ERROR';
export interface SearchState {
    isFetchingAggs: boolean,
    aggs: SearchPageAggsQuery | undefined,
    isFetchingAggBuckets: boolean,
    aggBuckets: any | SearchPageAggBucketsQuery | undefined,
    isFetchingCrowdAggBuckets: boolean,
    crowdAggBuckets: any | SearchPageCrowdAggBucketsQuery | undefined,
    isFetchingSearchParams: boolean,
    searchResults: typeof SearchPageParamsQuery | undefined
    isFetchingStudies: boolean,
    studies: SearchPageSearchQuery | undefined
    isUpdatingParams: boolean,
    searchHash: any;
    isFetchingAutoSuggest: boolean,
    suggestions: Array<any>
}
export interface SearchDataError {
    message: string
};

export interface FetchSearchPageAggsSendAction {
    type: typeof FETCH_SEARCH_PAGE_AGGS_SEND
    searchParams: any
};

export interface FetchSearchPageAggsSuccessAction {
    type: typeof FETCH_SEARCH_PAGE_AGGS_SUCCESS,
    payload: SearchPageAggsQuery
};

export interface FetchSearchPageAggsErrorAction {
    type: typeof FETCH_SEARCH_PAGE_AGGS_ERROR,
    payload: SearchDataError
};

export interface FetchSearchPageAggBucketsSendAction {
    type: typeof FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND
    searchParams: any                                   //TODO CHeck
};

export interface FetchSearchPageAggBucketsSuccessAction {
    type: typeof FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS,
    payload: SearchPageAggBucketsQuery | any
};

export interface FetchSearchPageAggBucketsErrorAction {
    type: typeof FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR,
    payload: SearchDataError
};


export interface FetchSearchPageCrowdAggBucketsSendAction {
    type: typeof FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND
    searchParams: any                                           //TODO Check
};

export interface FetchSearchPageCrowdAggBucketsSuccessAction {
    type: typeof FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS,
    payload: SearchPageCrowdAggBucketsQuery | any
};

export interface FetchSearchPageCrowdAggBucketsErrorAction {
    type: typeof FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR,
    payload: SearchDataError
};


export interface FetchSearchParamsSendAction {
    type: typeof FETCH_SEARCH_PARAMS_SEND
    hash: any
};

export interface FetchSearchParamsSuccessAction {
    type: typeof FETCH_SEARCH_PARAMS_SUCCESS,
    payload: typeof SearchPageParamsQuery
};

export interface FetchSearchParamsErrorAction {
    type: typeof FETCH_SEARCH_PARAMS_ERROR,
    payload: SearchDataError
};
export interface UpdateSearchParamsSendAction {
    type: typeof UPDATE_SEARCH_PARAMS_SEND
    searchParams: any
};

export interface UpdateSearchParamsSuccessAction {
    type: typeof UPDATE_SEARCH_PARAMS_SUCCESS,
    payload: typeof SearchPageParamsQuery
};

export interface UpdateSearchParamsErrorAction {
    type: typeof UPDATE_SEARCH_PARAMS_ERROR,
    payload: SearchDataError
};

export interface FetchSearchStudiesSendAction {
    type: typeof FETCH_SEARCH_STUDIES_SEND
    searchParams: any
};

export interface FetchSearchStudiesSuccessAction {
    type: typeof FETCH_SEARCH_STUDIES_SUCCESS,
    payload: SearchPageSearchQuery
};

export interface FetchSearchStudiesErrorAction {
    type: typeof FETCH_SEARCH_STUDIES_ERROR,
    payload: SearchDataError
};

export interface FetchSearchAutoSuggestSendAction {
    type: typeof FETCH_SEARCH_AUTOSUGGEST_SEND
    searchParams: any
};

export interface FetchSearchAutoSuggestSuccessAction {
    type: typeof FETCH_SEARCH_AUTOSUGGEST_SUCCESS,
    payload: any
};

export interface FetchSearchAutoSuggestErrorAction {
    type: typeof FETCH_SEARCH_AUTOSUGGEST_ERROR,
    payload: SearchDataError
};

export type SearchActionTypes = 
    FetchSearchPageAggsSendAction | FetchSearchPageAggsSuccessAction | FetchSearchPageAggsErrorAction |
    FetchSearchPageAggBucketsSendAction | FetchSearchPageAggBucketsSuccessAction | FetchSearchPageAggBucketsErrorAction |
    FetchSearchPageCrowdAggBucketsSendAction | FetchSearchPageCrowdAggBucketsSuccessAction | FetchSearchPageCrowdAggBucketsErrorAction |
    FetchSearchParamsSendAction | FetchSearchParamsSuccessAction | FetchSearchParamsErrorAction |
    UpdateSearchParamsSendAction | UpdateSearchParamsSuccessAction | UpdateSearchParamsErrorAction |
    FetchSearchStudiesSendAction | FetchSearchStudiesSuccessAction | FetchSearchStudiesErrorAction |
    FetchSearchAutoSuggestSendAction | FetchSearchAutoSuggestSuccessAction | FetchSearchAutoSuggestErrorAction;