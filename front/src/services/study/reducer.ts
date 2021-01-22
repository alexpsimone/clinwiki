import * as types from './types';

const initialState: types.StudyState = {
    isFetchingStudy: false,
    studyPage: undefined,
    isFetchingPageViews: false,
    pageViews: undefined,
    isFetchingPageView: false,
    pageView: undefined,
    isFetchingSearchStudyPage: false,
    searchStudyPage: undefined,
    isUpdatingStudyViewLogCount: false
};

const studyReducer = ( state = initialState, action: types.StudyActionTypes) : types.StudyState => {
    switch(action.type) {
        case types.FETCH_PAGE_VIEWS_SEND:
            return {
                ...state,
                isFetchingStudy: true
            };
        case types.FETCH_STUDY_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingStudy: false,
                studyPage: action.payload
            };
        case types.FETCH_STUDY_PAGE_ERROR:
            return {
                ...state,
                isFetchingStudy: false
            };
        case types.FETCH_PAGE_VIEWS_SEND:
            return {
                ...state,
                isFetchingPageViews: true
            };
        case types.FETCH_PAGE_VIEWS_SUCCESS:
            return {
                ...state,
                isFetchingPageViews: false,
                pageViews: action.payload
            };
        case types.FETCH_PAGE_VIEWS_ERROR:
            return {
                ...state,
                isFetchingPageViews: false
            };
        case types.FETCH_PAGE_VIEW_SEND:
            return {
                ...state,
                isFetchingPageView: true
            };
        case types.FETCH_PAGE_VIEW_SUCCESS:
            return {
                ...state,
                isFetchingPageViews: false,
                pageView: action.payload
            };
        case types.FETCH_PAGE_VIEW_ERROR:
            return {
                ...state,
                isFetchingPageView: false
            };
        case types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND:
            return {
                ...state,
                isUpdatingStudyViewLogCount: true
            };
        case types.UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS:
            return {
                ...state,
                isUpdatingStudyViewLogCount: false,
            };
        case types.UPDATE_STUDY_VIEW_LOG_COUNT_ERROR:
            return {
                ...state,
                isUpdatingStudyViewLogCount: false
            };
        case types.FETCH_SEARCH_STUDY_PAGE_SEND:
            return {
                ...state,
                isFetchingSearchStudyPage: true
            };
        case types.FETCH_SEARCH_STUDY_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingSearchStudyPage: false,
                searchStudyPage: action.payload
            };
        case types.FETCH_SEARCH_STUDY_PAGE_ERROR:
            return {
                ...state,
                isFetchingSearchStudyPage: false
            };
                
        default:
            return {...state};
    }
}

export default studyReducer;
