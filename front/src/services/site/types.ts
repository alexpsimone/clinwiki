import { SitesPageQuery } from 'services/site/model/SitesPageQuery';
import { AdminViewsProviderQuery } from 'services/site/model/AdminViewsProviderQuery';
import { DeleteSiteMutationsSitesQuery} from 'services/site/model/DeleteSiteMutationsSitesQuery'
import { DeleteSiteMutation} from 'services/site/model/DeleteSiteMutation' //!  need mutation import?


export const FETCH_ADMIN_SITE_VIEW_SEND = 'FETCH_ADMIN_SITE_VIEW_SEND';
export const FETCH_ADMIN_SITE_VIEW_SUCCESS = 'FETCH_ADMIN_SITE_VIEW_SUCCESS';
export const FETCH_ADMIN_SITE_VIEW_ERROR = 'FETCH_ADMIN_SITE_VIEW_ERROR';

export const FETCH_SITES_PAGE_SEND = 'FETCH_SITES_PAGE_SEND';
export const FETCH_SITES_PAGE_SUCCESS = 'FETCH_SITES_PAGE_SUCCESS';
export const FETCH_SITES_PAGE_ERROR = 'FETCH_SITES_PAGE_ERROR';

export const DELETE_SITE_SEND = 'DELETE_SITE_SEND';
export const DELETE_SITE_SUCCESS = 'DELETE_SITE_SUCCESS';
export const DELETE_SITE_ERROR = 'DELETE_SITE_ERROR';




export interface SiteState {
    isFetchingAdminSiteView: boolean,
    adminSiteView: AdminViewsProviderQuery | undefined;
    isFetchingSitesPage: boolean,
    sitesPage: SitesPageQuery | undefined,
    isDeletingSite: boolean,
    siteData: DeleteSiteMutationsSitesQuery | undefined,  //! need deleted site query data?
}

export interface SiteDataError {
    message: string
};

export interface SiteData {  //! need SiteData for action success?
    id: number
    me: any
};

export interface FetchAdminSiteViewSendAction {
    type: typeof FETCH_ADMIN_SITE_VIEW_SEND
};

export interface FetchAdminSiteViewSuccessAction {
    type: typeof FETCH_ADMIN_SITE_VIEW_SUCCESS,
    payload: AdminViewsProviderQuery
};

export interface FetchAdminSiteViewErrorAction {
    type: typeof FETCH_ADMIN_SITE_VIEW_ERROR,
    payload: SiteDataError
};

export interface FetchSitesPageSendAction {
    type: typeof FETCH_SITES_PAGE_SEND
};

export interface FetchSitesPageSuccessAction {
    type: typeof FETCH_SITES_PAGE_SUCCESS,
    payload: SitesPageQuery
};

export interface FetchSitesPageErrorAction {
    type: typeof FETCH_SITES_PAGE_ERROR,
    payload: SiteDataError
};


export interface DeleteSiteSendAction {
    type: typeof DELETE_SITE_SEND,
    id: number
}

export interface DeleteSiteSuccessAction {
    type: typeof DELETE_SITE_SUCCESS,
    payload: DeleteSiteMutationsSitesQuery
};

export interface DeleteSiteErrorAction {
    type: typeof DELETE_SITE_ERROR,
    payload: SiteDataError
};


export type SiteActionTypes = FetchAdminSiteViewSendAction | FetchAdminSiteViewSuccessAction | FetchAdminSiteViewErrorAction |
    FetchSitesPageSendAction | FetchSitesPageSuccessAction | FetchSitesPageErrorAction | DeleteSiteSendAction | DeleteSiteSuccessAction |
    DeleteSiteErrorAction;
