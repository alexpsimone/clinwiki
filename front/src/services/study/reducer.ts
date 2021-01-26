import * as types from './types';

const initialState: types.StudyState = {
    isFetchingStudy: false,
    studyPage: undefined,
    isFetchingPageViews: false,
    pageViews: undefined,
    isFetchingPageView: false,
    pageView: undefined,
    isUpdatingStudyViewLogCount: false,
    isFetchingWorkflow: false,
    workflowPage: undefined,
    isUpsertingLabel: false, 
    isDeletingLabel: false,
    isFetchingCrowdPage: false,
    crowdPage: undefined,
    isFetchingSuggestedLabels: false,
    suggestedLabels: undefined,
    isFetchingAllWorkFlows: false,
    allWorkFlows: undefined,
};

const studyReducer = ( state = initialState, action: types.StudyActionTypes) : types.StudyState => {
    switch(action.type) {
        case types.FETCH_STUDY_PAGE_SEND:
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
        case types.FETCH_WORKFLOW_PAGE_SEND:
            return {
                ...state,
                isFetchingWorkflow: true
            };
        case types.FETCH_WORKFLOW_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingWorkflow: false,
                workflowPage: action.payload
            };
        case types.FETCH_WORKFLOW_PAGE_ERROR:
            return {
                ...state,
                isFetchingWorkflow: false
            };
        case types.FETCH_CROWD_PAGE_SEND:
            return {
                ...state,
                isFetchingCrowdPage: true
            };
        case types.FETCH_CROWD_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingCrowdPage: false,
                crowdPage: action.payload
            };
        case types.FETCH_CROWD_PAGE_ERROR:
            return {
                ...state,
                isFetchingCrowdPage: false
            };
        case types.FETCH_SUGGESTED_LABELS_SEND:
            return {
                ...state,
                isFetchingSuggestedLabels: true
            };
        case types.FETCH_SUGGESTED_LABELS_SUCCESS:
            return {
                ...state,
                isFetchingSuggestedLabels: false,
                suggestedLabels: action.payload
            };
        case types.FETCH_SUGGESTED_LABELS_ERROR:
            return {
                ...state,
                isFetchingSuggestedLabels: false
            };
        case types.FETCH_ALL_WORKFLOWS_SEND:
            return {
                ...state,
                isFetchingAllWorkFlows: true
            };
        case types.FETCH_ALL_WORKFLOWS_SUCCESS:
            return {
                ...state,
                isFetchingAllWorkFlows: false,
                allWorkFlows: action.payload
            };
        case types.FETCH_ALL_WORKFLOWS_ERROR:
            return {
                ...state,
                isFetchingAllWorkFlows: false
            };
        case types.FETCH_ALL_WORKFLOWS_SEND:
            return {
                ...state,
                isFetchingAllWorkFlows: true
            };
        case types.FETCH_ALL_WORKFLOWS_SUCCESS:
            return {
                ...state,
                isFetchingAllWorkFlows: false,
                allWorkFlows: action.payload
            };
        case types.FETCH_ALL_WORKFLOWS_ERROR:
            return {
                ...state,
                isFetchingAllWorkFlows: false
            };
        default:
            return {...state};
    }
}

export default studyReducer;