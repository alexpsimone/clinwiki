import * as React from 'react';
import { gql, ApolloError }  from '@apollo/client';
import {
  Mutation,
  MutationComponentOptions,
} from '@apollo/client/react/components';
import { MutationFunction, MutationResult } from '@apollo/client';
import {
  UpdateSiteViewMutation as UpdateSiteViewMutationType,
  UpdateSiteViewMutationVariables,
} from 'types/UpdateSiteViewMutation';
import { OLD_SITE_VIEW_FRAGMENT } from '../services/site/SiteFragments'

interface UpdateSiteViewMutationProps {
  children: (
    mutate: UpdateSiteViewMutationFn,
    result: MutationResult<UpdateSiteViewMutationType>
  ) => JSX.Element;
  onCompleted?: (data: UpdateSiteViewMutationType) => void;
  onError?: (e: ApolloError) => void;
}

const UPDATE_SITE_VIEW_MUTATION = gql`
  mutation UpdateSiteViewMutation($input: UpdateSiteViewInput!) {
    updateSiteView(input: $input) {
      siteView {
        ...SiteViewFragment
      }
      errors
    }
  }

  ${OLD_SITE_VIEW_FRAGMENT}
`;

const UpdateSiteViewMutationComponent = (
  props: MutationComponentOptions<
    UpdateSiteViewMutationType,
    UpdateSiteViewMutationVariables
  >
) => Mutation(props);
export type UpdateSiteViewMutationFn = MutationFunction<
  UpdateSiteViewMutationType,
  UpdateSiteViewMutationVariables
>;

class UpdateSiteViewMutation extends React.PureComponent<
  UpdateSiteViewMutationProps
> {
  render() {
    return (
      <UpdateSiteViewMutationComponent
        mutation={UPDATE_SITE_VIEW_MUTATION}
        onCompleted={this.props.onCompleted}
        onError={this.props.onError}>
        {this.props.children}
      </UpdateSiteViewMutationComponent>
    );
  }
}

export default UpdateSiteViewMutation;
