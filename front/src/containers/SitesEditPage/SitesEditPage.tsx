import * as React from 'react';
import SiteForm from 'components/SiteForm/SiteForm';
import UpdateSiteMutation, {
  UpdateSiteMutationFn,
} from 'mutations/UpdateSiteMutation';
import { CreateSiteInput } from 'types/globalTypes';
import { match } from 'react-router';
import SiteProvider from 'containers/SiteProvider';
import { History, Location } from 'history';
import UpdateSiteViewMutation from 'mutations/UpdateSiteViewMutation';

interface SitesEditPageProps {
  match: match<{ id: string }>;
  history: History;
  location: Location;
}

class SitesEditPage extends React.PureComponent<SitesEditPageProps> {
  handleSave = (updateSite: UpdateSiteMutationFn) => (
    input: CreateSiteInput
  ) => {
    updateSite({
      variables: {
        input: { ...input, id: parseInt(this.props.match.params.id, 10) },
      },
    });
  };

  render() {
    return (
      <SiteProvider id={parseInt(this.props.match.params.id, 10)}>
        {(site, refetch) => (
          <UpdateSiteViewMutation>
            {updateSiteView => (
              <UpdateSiteMutation
                onCompleted={() => this.props.history.push('/sites')}>
                {updateSite => (
                  <SiteForm
                    match={this.props.match}
                    history={this.props.history}
                    location={this.props.location}
                    refresh={refetch}
                    site={site}
                    onSaveSite={this.handleSave(updateSite)}
                    onSaveSiteView={updateSiteView}
                  />
                )}
              </UpdateSiteMutation>
            )}
          </UpdateSiteViewMutation>
        )}
      </SiteProvider>
    );
  }
}

export default SitesEditPage;
