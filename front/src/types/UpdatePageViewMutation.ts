/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdatePageViewInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePageViewMutation
// ====================================================

export interface UpdatePageViewMutation_updatePageView_pageView {
  __typename: "PageView";
  id: number;
  url: string;
  title: string;
  default: boolean;
  template: string;
  pageType: string;
}

export interface UpdatePageViewMutation_updatePageView {
  __typename: "UpdatePageViewPayload";
  errors: string[] | null;
  pageView: UpdatePageViewMutation_updatePageView_pageView | null;
}

export interface UpdatePageViewMutation {
  updatePageView: UpdatePageViewMutation_updatePageView | null;
}

export interface UpdatePageViewMutationVariables {
  input: UpdatePageViewInput;
}
