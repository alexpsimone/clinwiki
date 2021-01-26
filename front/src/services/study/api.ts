import * as query from './queries';
import * as mutate from './mutations'
import { callGraphql } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = `http://${window.location.hostname}:3000/graphql`

export const fetchStudyPage= (nctId: any, QUERY:any) => {
    return callGraphql(ENDPOINT, QUERY, {nctId});
};
export const fetchPageViews= (siteId: any) => {
    return callGraphql(ENDPOINT, query.PAGE_VIEWS_QUERY, {siteId: siteId.siteId});
};
export const fetchPageView= (url:any) => {
    return callGraphql(ENDPOINT, query.PAGE_VIEW_QUERY, {url: url.url});
};
export const updateStudyViewLogCount = (nctId:any) =>{
    return callGraphql(ENDPOINT,mutate.CREATE_STUDY_VIEW_LOG_MUTATION, {nctId})
}
export const fetchWorkFlowPage = (nctId: any) =>{
    return callGraphql(ENDPOINT, query.WORKFLOW_PAGE_QUERY, {nctId});
}
export const upsertLabelMutation = (nctId:any, key: any, value: any) =>{
    return callGraphql(ENDPOINT,mutate.UPSERT_LABEL_MUTATION, {nctId: nctId, key: key, value: value})
}
export const deleteLabelMutation = (nctId:any, key: any, value: any) =>{
    return callGraphql(ENDPOINT,mutate.DELETE_LABEL_MUTATION, { nctId: nctId, key: key, value: value})
}
export const fetchCrowdPage= (nctId: any) => {
    return callGraphql(ENDPOINT, query.CROWD_PAGE_QUERY, {nctId});
}
export const fetchSuggestedLabels= (nctId: any, crowdBucketsWanted: any) => {
    return callGraphql(ENDPOINT, query.SUGGESTED_LABELS_QUERY, {nctId: nctId, crowdBucketsWanted: crowdBucketsWanted});
};
export const fetchAllWorkFlows= () => {
    return callGraphql(ENDPOINT, query.WORKFLOW_VIEW_PROVIDER, {});
};