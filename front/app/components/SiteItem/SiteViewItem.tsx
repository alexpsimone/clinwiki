import * as React from 'react';
import styled from 'styled-components';
import { Button, Checkbox, FormControl } from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { withRouter } from 'react-router-dom';
import DeleteSiteViewMutation, {
  DeleteSiteViewMutationFn,
} from 'mutations/DeleteSiteViewMutation';
import { History, Location } from 'history';
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn,
} from 'mutations/UpdateSiteViewMutation';
import CopySiteViewMutation, {
  CopySiteViewMutationFn,
} from 'mutations/CopySiteViewMutation';

interface SiteViewItemProps {
  match: any;
  history: History;
  location: Location;
  refresh: () => void;
  siteView: SiteViewFragment;
  site: any;
}

const StyledButton = styled(Button)`
  margin-right: 15px;
`;
// const PreviewText;

class SiteViewItem extends React.PureComponent<SiteViewItemProps> {
  handleEditClick = () => {
    const siteViewId = this.props.siteView.id;
    const siteId = this.props.match.params.id;
    this.props.history.push(
      `/sites/${siteId}/edit/siteviews/${siteViewId}/edit`
    );
  };

  handleCheckbox = (updateSiteView: UpdateSiteViewMutationFn) => {
    const { siteView } = this.props;
    if (siteView.default) {
      alert('There must be a default site view.');
      return null;
    }
    updateSiteView({
      variables: {
        input: {
          default: true,
          id: siteView.id,
          mutations: [],
          name: siteView.name,
        },
      },
    }).then(() => {
      this.props.refresh();
    });
  };

  handleDelete = (deleteSiteView: DeleteSiteViewMutationFn) => {
    const { siteView } = this.props;
    if (siteView.default) {
      alert('There must be a default site.');
      return null;
    }
    if (!window) return;
    if (window.confirm('Are you sure?')) {
      deleteSiteView({
        variables: {
          input: {
            id: siteView.id,
          },
        },
      }).then(res => {
        // console.log(res);
        this.props.refresh();
      });
    }
  };

  handleCopy = (copySiteView: CopySiteViewMutationFn) => {
    const { siteView, site } = this.props;
    const copiedName = `${siteView.name}copy`;
    const copiedUrl = `${siteView.url}copy`;
    copySiteView({
      variables: {
        input: {
          name: copiedName,
          url: copiedUrl,
          default: false,
          siteId: site.id,
          siteViewId: siteView.id,
        },
      },
    }).then(res => {
      this.props.refresh();
    });
  };

  render() {
    const { siteView } = this.props;
    const urlString = 'clinwiki.org/search/' + siteView.url;
    // console.log(urlString);
    return (
      <tr>
        <td>{siteView.name}</td>
        <td>{siteView.url}</td>

        <td>
          <UpdateSiteViewMutation>
            {updateSiteView => (
              <Checkbox
                checked={siteView.default}
                onChange={() => this.handleCheckbox(updateSiteView)}
              />
            )}
          </UpdateSiteViewMutation>
        </td>
        <td>{urlString}</td>
        <td>
          <StyledButton onClick={this.handleEditClick}>Edit</StyledButton>
          <CopySiteViewMutation>
            {copySiteView => (
              <StyledButton onClick={() => this.handleCopy(copySiteView)}>
                Copy
              </StyledButton>
            )}
          </CopySiteViewMutation>
          <DeleteSiteViewMutation>
            {deleteSiteView => (
              <StyledButton onClick={() => this.handleDelete(deleteSiteView)}>
                Delete
              </StyledButton>
            )}
          </DeleteSiteViewMutation>
        </td>
      </tr>
    );
  }
}

//@ts-ignore
export default withRouter(SiteViewItem);
