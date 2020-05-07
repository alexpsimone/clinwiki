import * as React from 'react';
import styled from 'styled-components';
import SearchPage from 'containers/SearchPage';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import {
  ThemedMainContainer,
  SearchContainer,
  StyledProfileLabel,
  StyledProfileValue,
  StyledProfileForm,
} from 'components/StyledComponents';
import ProfileScoreBoard from './components/ProfileScoreBoard';
import ProfilePicture from './components/ProfilePicture';
import ReviewsTable from './components/ReviewsTable';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

interface ProfilePageProps {
  history: History;
  location: Location;
  match: any;
}
interface ProfilePageState {
  currentDisplay: string;
}
const USER_QUERY = gql`
  query User($userId: Int!) {
    user(userId: $userId) {
      firstName
      lastName
      reviewCount
      reviews {
        nctId
        briefTitle
        content
      }
      contributions
      pictureUrl
    }
  }
`;
class ProfilePage extends React.Component<ProfilePageProps, ProfilePageState> {
  state: ProfilePageState = {
    currentDisplay: 'contributions',
  };

  getUserParams = (userId: string) => {
    return {
      q: { key: 'AND', children: [] },
      aggFilters: [{ field: 'userId', values: [userId] }],
      crowdAggFilters: [],
      sorts: [],
      page: 0,
      pageSize: 25,
    };
  };
  handleDisplayChange = display => {
    this.setState({ currentDisplay: display });
  };
  renderResults = reviews => {
    switch (this.state.currentDisplay) {
      case 'reviews':
        return (
          <ReviewsTable reviewData={reviews} history={this.props.history} />
        );
      case 'contributions':
        return (
          <SearchPage
            history={this.props.history}
            location={this.props.location}
            match={this.props.match}
            email={this.props.match.params.id}
            profileParams={this.getUserParams(this.props.match.params.id)}
          />
        );
    }
  };
  render() {
    let userId = new URLSearchParams(this.props.location.search)
      .getAll('uid')
      .toString();
    return (
      <Query query={USER_QUERY} variables={{ userId: 1 }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>;
          if (error) return <div>Error</div>;
          const userData = data;
          return (
            <div>
              <ThemedMainContainer>
                <ProfilePicture pictureUrl={userData.user.pictureUrl} />
                <h2 style={{ marginLeft: '1em' }}>
                  {userData.user.firstName}'s Contributions
                </h2>
                <SearchContainer>
                  <ProfileScoreBoard
                    totalPoints={0}
                    totalContributions={userData.user.contributions}
                    totalReviews={userData.user.reviewCount}
                    totalTags={'Coming Soon'}
                    totalFavorites={0}
                    handleDisplayChange={this.handleDisplayChange}
                  />
                </SearchContainer>
                {this.renderResults(userData.user.reviews)}
              </ThemedMainContainer>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ProfilePage;