import * as React from 'react';
import { CreateSiteInput, SiteViewMutationInput } from 'types/globalTypes';
import { equals, prop, last } from 'ramda';
import { Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { trimPath } from 'utils/helpers';
import { SiteFragment } from 'types/SiteFragment';
import { StyledContainer } from './Styled';
import {
  updateView,
  createMutation,
  getViewValueByPath,
  serializeMutation,
} from 'utils/siteViewUpdater';
import { Switch, Route, match, Redirect } from 'react-router';
import MainForm from './MainForm';
import SiteViewsRouter from './SiteViewsRouter';
import { History, Location } from 'history';
import StudyForm from './StudyForm';
import ThemedButton from 'components/StyledComponents/index';
import { UpdateSiteViewMutationFn } from 'mutations/UpdateSiteViewMutation';

interface SiteFormProps {
  match: match<{}>;
  site: SiteFragment;
  history: History;
  location: Location;
  onSaveSite: (CreateSiteInput) => void;
  onSaveSiteView?: UpdateSiteViewMutationFn;
  refresh: any;
}

interface SiteFormState {
  form: CreateSiteInput;
  mutations: SiteViewMutationInput[];
  addEditorEmail: string;
  prevForm: CreateSiteInput | null;
  inSiteViewEdit: boolean;
  disableSubmit: boolean;
}

const Container = styled.div`
  ul > li > a {
    color: white;

    &:hover {
      color: #333;
    }
  }
`;

const StyledNav = styled(Nav)`
  margin: 15px;
`;

class SiteForm extends React.Component<SiteFormProps, SiteFormState> {
  state: SiteFormState = {
    form: {
      name: '',
      subdomain: '',
      skipLanding: false,
      editorEmails: [],
    },
    disableSubmit: false,
    mutations: [],
    addEditorEmail: '',
    prevForm: null,
    inSiteViewEdit: false,
  };

  static getDerivedStateFromProps = (
    props: SiteFormProps,
    state: SiteFormState
  ): SiteFormState | null => {
    const {
      name,
      subdomain,
      skipLanding,
      editors,
      themes,
      userRank,
      reactionsConfig,
    } = props.site;
    const editorEmails = editors.map(prop('email')) as string[];
    const form = {
      name,
      subdomain,
      skipLanding,
      editorEmails,
      themes,
      userRank,
      reactionsConfig,
    };
    if (form && !equals(form, state.prevForm as any)) {
      return { ...state, form, prevForm: form };
    }
    return null;
  };
  toggleSiteViewEdit = () => {
    this.setState({ inSiteViewEdit: true });
  };
  toggleEditFalse = () => {
    this.setState({ inSiteViewEdit: false });
  };
  handleSave = () => {
    this.props.onSaveSite(this.state.form);
    if (this.state.mutations.length > 0) {
      const view = this.props.site.siteView;
      this.props.onSaveSiteView?.({
        variables: {
          input: {
            id: view.id,
            name: view.name,
            url: view.url,
            default: view.default,
            mutations: this.state.mutations.map(serializeMutation),
          }
        },
      });
    }
  };

  handleAddMutation = (e: { currentTarget: { name: string; value: any } }) => {
    const { name, value } = e.currentTarget;
    console.log(`mutation: ${name}=${value}`);
    const mutation = createMutation(name, value);
    const view = updateView(this.props.site.siteView, this.state.mutations);
    const currentValue = getViewValueByPath(mutation.path, view);
    if (equals(value, currentValue)) return;
    this.setState({ mutations: [...this.state.mutations, mutation] }, () =>
      console.log('handleadd', mutation, view, currentValue)
    );
  };

  handleFormChange = (form: CreateSiteInput) => {
    console.log(form);
    this.setState({ form });
  };

  handleThemeError = error => {
    console.log('errr', error);
    this.setState({ disableSubmit: error });
  };

  renderTabs = () => {
    const path = trimPath(this.props.match.url);
    let sections;
    if (path === '/sites/new') {
      sections = [
        { path: '/main', value: 'Main' },
        { path: '/study', value: 'Study' },
      ];
    } else
      sections = [
        { path: '/main', value: 'Main' },
        { path: '/siteviews', value: 'Views' },
        { path: '/study', value: 'Study' },
      ];

    const locationComponents = this.props.location.pathname.split('/');
    let activeKey = last(locationComponents);
    if (locationComponents[locationComponents.length - 2] === 'study') {
      activeKey = 'study';
    }
    activeKey = `/${activeKey}`;

    return (
      <StyledNav
        bsStyle="pills"
        activeKey={activeKey}
        onSelect={key => this.props.history.push(`${path}${key}`)}>
        {sections.map(section => (
          <NavItem key={`${section.path}`} eventKey={`${section.path}`}>
            {section.value}
          </NavItem>
        ))}
      </StyledNav>
    );
  };

  render() {
    const view = updateView(this.props.site.siteView, this.state.mutations);
    const path = trimPath(this.props.match.path);
    return (
      <Container>
        <h3 style={{ color: 'white', marginLeft: 15 }}>
          {this.props.site.name}
        </h3>
        {this.renderTabs()}
        <Switch>
          <Route
            path={`${path}/main`}
            render={() => (
              <MainForm
                handleThemeError={this.handleThemeError}
                form={this.state.form}
                onFormChange={this.handleFormChange}
                handleForm={this.toggleEditFalse}
              />
            )}
          />
          <Route
            path={`${path}/siteviews`}
            render={props => (
              <SiteViewsRouter
                {...props}
                siteViews={this.props.site.siteViews}
                refresh={this.props.refresh}
                site={this.props.site}
                handleSiteViewEdit={this.toggleSiteViewEdit}
                handleForm={this.toggleEditFalse}
              />
            )}
          />
          <Route
            path={`${path}/study`}
            render={routeProps => (
              <StudyForm
                {...routeProps}
                view={view}
                onAddMutation={this.handleAddMutation}
                handleForm={this.toggleEditFalse}
              />
            )}
          />
          <Redirect to={`${path}/main`} />
        </Switch>
        {this.state.inSiteViewEdit ? null : (
          <StyledContainer>
            <ThemedButton
              disabled={this.state.disableSubmit}
              onClick={() => this.handleSave()}>
              Save
            </ThemedButton>
          </StyledContainer>
        )}
      </Container>
    );
  }
}

export default SiteForm;
