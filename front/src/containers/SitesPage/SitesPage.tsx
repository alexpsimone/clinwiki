import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { SiteItem } from 'components/SiteItem';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { History } from 'history';
/* import DeleteSiteMutation, {
  DeleteSiteMutationFn,
} from 'mutations/DeleteSiteMutations'; */
import ThemedButton from 'components/StyledComponents/index';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSite, fetchSitesPage } from 'services/site/actions'
import { useEffect } from 'react';
import {RootState} from 'reducers';
import { BeatLoader } from 'react-spinners';

const Container = styled.div`
padding: 20px;
`;

const ButtonsContainer = styled.div`
display: flex;
justify-content: flex-end;
margin-bottom: 20px;
`;
interface SitesPageProps {
  history: History;
}

const SitesPage = ({history} : SitesPageProps) => {

  const dispatch = useDispatch();
  const data = useSelector((state : RootState ) => state.site.sitesPage)
  const isLoading = useSelector((state : RootState ) => state.site.isFetchingSitesPage)

  const handleCreateSite = () => {
    history.push('/sites/new');
  };
  const handleSiteEdit = (id: number) => {
    history.push(`/sites/${id}/edit`);
  };
  const handleSiteDelete = (id: number) => {  //! We moved queries into the redux dir, what about mutations?
    dispatch(deleteSite(id));
  };

  useEffect(() => {
    dispatch(fetchSitesPage());
  },[ dispatch ]); 
  

if (data === undefined || isLoading) {
  return <BeatLoader color="#cccccc" />
}
  return (
    <Container>
      <CollapsiblePanel header="My Sites">
        {data?.me.ownSites.length > 0 && (
          <Table striped bordered condensed>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subdomain</th>
                <th />
              </tr>
            </thead>
            <tbody>            
                  <>
                    {data!.me!.ownSites.map(site => (  //!Sites Data.   USe selector to get the current sites. 
                      <SiteItem
                        site={site}
                        key={site.subdomain}
                        onEdit={handleSiteEdit}
                        onDelete={handleSiteDelete(site.id)} //! onDelete dispatch the delete site action
                      />
                    ))}
                  </>
               
            </tbody>
          </Table>
        )}
        {data.me.ownSites.length === 0 && 'No sites yet'}
      </CollapsiblePanel>
      <ButtonsContainer>
        <ThemedButton onClick={handleCreateSite}>
          Create Site
        </ThemedButton>
      </ButtonsContainer>
      <CollapsiblePanel header="Editable Sites">
        {data.me.editorSites.length > 0 && (
          <Table striped bordered condensed>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subdomain</th>
              </tr>
            </thead>
            <tbody>
              {data.me.editorSites.map(site => (
                <SiteItem
                  site={site}
                  key={site.subdomain}
                  onEdit={handleSiteEdit}
                />
              ))}
            </tbody>
          </Table>
        )}
        {data.me.editorSites.length === 0 && 'No sites yet'}
      </CollapsiblePanel>
    </Container>
  );
}

export default SitesPage;
