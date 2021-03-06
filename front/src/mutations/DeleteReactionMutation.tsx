import * as React from 'react';
import { gql }  from '@apollo/client';
import {
  Mutation,
  MutationComponentOptions,
} from '@apollo/client/react/components';
import { MutationFunction, MutationResult } from '@apollo/client';
import {
  DeleteReaction as DeleteReactionType,
  DeleteReactionVariables,
} from 'types/DeleteReaction';

interface DeleteReactionProps {
  children: (
    mutate: DeleteReactionFn,
    result: MutationResult<DeleteReactionType>
  ) => JSX.Element;
}

const DELETE_REACTION = gql`
  mutation DeleteReaction(
    $id: Int!

  ) {
    deleteReaction(
        input : { id: $id }
    ) {
      reaction{
        study{
          dislikesCount
        }
 }

      errors
    }
  }
`;

const DeleteReactionComponent = (
  props: MutationComponentOptions<
    DeleteReactionType,
    DeleteReactionVariables
  >
) => Mutation(props);
export type DeleteReactionFn = MutationFunction<
  DeleteReactionType,
  DeleteReactionVariables
>;

class DeleteReaction extends React.PureComponent<
  DeleteReactionProps
> {
  render() {
    return (
      <DeleteReactionComponent mutation={DELETE_REACTION}>
        {this.props.children}
      </DeleteReactionComponent>
    );
  }
}

export default DeleteReaction;
