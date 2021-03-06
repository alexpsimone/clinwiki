import * as React from 'react';
import gql from 'graphql-tag';
import { graphql }  from '@apollo/client/react/hoc' ;
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents/index';
import LoginModal from 'components/LoginModal';
import Snackbar from 'components/Snackbar';
import LabeledButton from 'components/LabeledButton';

const CREATE_SAVED_SEARCH_MUTATION = gql`
  mutation CreateSavedSearchMutation($searchHash: String!, $url: String!){
  createSavedSearch(input: {
    searchHash: $searchHash,
    url: $url
  }) {
    savedSearch {
      shortLink
      {
        long
      	short
      }
      userId
      createdAt
      nameLabel
    }
    }
  }
`;


interface SaveSearchProps {
  siteView: any;
  searchHash: string;
  mutate: any;
  user?: any;
}

interface SaveSearchState {
  showLoginModal: boolean;
}

class SaveSearch extends React.Component<SaveSearchProps, SaveSearchState> {
  
  state = {
    showLoginModal: false,
  };
  


  render() {
    const { 
      mutate,
      searchHash, 
      user 
    } = this.props;
    
    const { showLoginModal } = this.state;
    const setShowLoginModal = showLoginModal => {
      this.setState({ showLoginModal });
    };
    
    const snackbarRef = React.createRef();
    const  _showSnackbarHandler = () => {
      //@ts-ignore
      this.snackbarRef.current.openSnackBar('Button Pressed...');
    }

    async function onClick() {
      console.log('window.location.href', window.location.href)
  
      if (user) {
          const url = window.location.href
          const { data } = await mutate({
          variables: { 
            searchHash: searchHash,
            url: url
          },
        });
        //TODO Give user notification / snackbar. FIX TS Errors
        //_showSnackbarHandler();
       //@ts-ignore
        //<Snackbar ref={snackbarRef}/>
        alert("Saved search: \n" + data?.createSavedSearch.savedSearch.nameLabel) 
      } else {
        setShowLoginModal(true);
      }
    }
    return (
      <>
        <LoginModal
          show={showLoginModal}
          cancel={() => setShowLoginModal(false)}
        />
      
       <LabeledButton
          helperText={"Save Search"}
          theClick={onClick}
          iconName={"bookmark"}
       />
       
      </>
    );
  }
}

export default graphql<any, any, any, any>(CREATE_SAVED_SEARCH_MUTATION)(
    SaveSearch
); 
