/* tslint:disable */
// This file was automatically generated and should not be edited.

import { DeleteSiteViewInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteSiteViewMutation
// ====================================================

export interface DeleteSiteViewMutation_deleteSiteView {
  __typename: "DeleteSiteViewPayload";
  error: string | null;
}

export interface DeleteSiteViewMutation {
  deleteSiteView: DeleteSiteViewMutation_deleteSiteView | null;
}

export interface DeleteSiteViewMutationVariables {
  input: DeleteSiteViewInput;
}
