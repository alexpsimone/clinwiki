import * as React from 'react';
import { gql }  from '@apollo/client';
import {
  Mutation,
  MutationComponentOptions,
} from '@apollo/client/react/components';
import { MutationFunction, MutationResult } from '@apollo/client'
import {
  CopySiteViewMutation as CopySiteViewMutationType,
  CopySiteViewMutationVariables,
} from 'types/CopySiteViewMutation';
import { SITE_VIEW_FRAGMENT } from '../services/site/SiteFragments'

interface CopySiteViewMutationProps {
  children: (
    mutate: CopySiteViewMutationFn,
    result: MutationResult<CopySiteViewMutationType>
  ) => JSX.Element;
  onCompleted?: (any) => void;
}

const COPY_SITE_VIEW_MUTATION = gql`
  mutation CopySiteViewMutation($input: CopySiteViewInput!) {
    copySiteView(input: $input) {
      siteView {
        ...SiteViewFragment
      }
      errors
    }
  }

  ${SITE_VIEW_FRAGMENT}
`;

const CopySiteViewMutationComponent = (
  props: MutationComponentOptions<
    CopySiteViewMutationType,
    CopySiteViewMutationVariables
  >
) => Mutation(props);
export type CopySiteViewMutationFn = MutationFunction<
  CopySiteViewMutationType,
  CopySiteViewMutationVariables
>;

class CopySiteViewMutation extends React.PureComponent<
  CopySiteViewMutationProps
> {
  render() {
    return (
      <CopySiteViewMutationComponent mutation={COPY_SITE_VIEW_MUTATION}>
        {this.props.children}
      </CopySiteViewMutationComponent>
    );
  }
}

export default CopySiteViewMutation;
