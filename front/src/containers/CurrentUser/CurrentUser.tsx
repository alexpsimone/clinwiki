import * as React from 'react';
import {useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { Query, QueryComponentOptions } from '@apollo/client/react/components';
import { gql, useQuery }  from '@apollo/client';
import { CurrentUserQuery } from 'types/CurrentUserQuery';
import { UserFragment } from 'types/UserFragment';
import { fetchUser } from 'services/user/actions';

/*
interface CurrentUserProps {
  children: (user: UserFragment | null, refetch?:any) => React.ReactNode;
}

const FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
    firstName
    lastName
    defaultQueryString
    roles
    reviewCount
    reviews {
      content
      briefTitle
      nctId
    }
    reactionsCount{
      name
      count
    }
    contributions
    pictureUrl
    rank
    reactions{
      id
      reactionKindId
      reactionKind{
        id
        name
      }
      study{
        briefTitle
      }
      nctId
    }
  }
`;

export const QUERY = gql`
  query CurrentUserQuery {
    me {
      ...UserFragment
    }
  }

  ${FRAGMENT}
`;

const QueryComponent = (props: QueryComponentOptions<CurrentUserQuery>) =>
  Query(props);
*/
/*
class CurrentUser extends React.PureComponent<CurrentUserProps> {
  static fragment = FRAGMENT;
  static query = QUERY;

  render() {
    return (
      <QueryComponent query={QUERY}>
        {({ data, loading, error, refetch }) => {
          if (loading || error || !data) {
            return this.props.children(null) as JSX.Element | null;
          }
          return this.props.children(data.me, refetch) as JSX.Element | null;
        }}
      </QueryComponent>
    );
  }
}

export function useCurrentUser() {
  return useQuery<CurrentUserQuery>(QUERY);
}
*/

const CurrentUser = (props) => {
  const dispatch = useDispatch();
  useEffect( () => {
    dispatch(fetchUser());
  },[dispatch]);
  return (
    <div>
      {props.children}
    </div>
  );
};

export default CurrentUser;
