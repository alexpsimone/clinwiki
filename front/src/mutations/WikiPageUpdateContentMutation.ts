
import { gql }  from '@apollo/client';
import { WikiPageEditFragment } from 'components/Edits';
import {
  WikiPageUpdateContentMutation,
  WikiPageUpdateContentMutationVariables,
} from 'types/WikiPageUpdateContentMutation';
import { Mutation, MutationComponentOptions } from '@apollo/client/react/components';
import { MutationFunction } from '@apollo/client'
const FRAGMENT = gql`
  fragment WikiPageFragment on WikiPage {
    content
    edits {
      ...WikiPageEditFragment
    }
    nctId
    meta
  }
  ${WikiPageEditFragment}
`;

export const UPDATE_CONTENT_MUTATION = gql`
  mutation WikiPageUpdateContentMutation($nctId: String!, $content: String!) {
    updateWikiContent(input: { nctId: $nctId, content: $content }) {
      wikiPage {
        ...WikiPageFragment
      }
      errors
    }
  }
  ${FRAGMENT}
`;

export const UpdateContentMutationComponent = (
  props: MutationComponentOptions<
    WikiPageUpdateContentMutation,
    WikiPageUpdateContentMutationVariables
  >
) => Mutation(props);

export type UpdateContentMutationFn = MutationFunction<
  WikiPageUpdateContentMutation,
  WikiPageUpdateContentMutationVariables
>;
