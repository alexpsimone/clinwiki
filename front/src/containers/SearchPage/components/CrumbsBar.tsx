import * as React from 'react';
import {
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import { ApolloConsumer } from '@apollo/client';
import * as Autosuggest from 'react-autosuggest';
import styled from 'styled-components';
import aggToField from 'utils/aggs/aggToField';
import MultiCrumb from 'components/MultiCrumb';
import AggCrumb from 'components/MultiCrumb/AggCrumb';
import { BeatLoader } from 'react-spinners';
import CurrentUser from 'containers/CurrentUser';
import { AggCallback, SearchParams } from '../Types';
import { isEmpty } from 'ramda';
import { PresentSiteFragment_siteView } from 'types/PresentSiteFragment';
import { displayFields } from 'utils/siteViewHelpers';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';
import {ThemedButton, ThemedSearchContainer} from 'components/StyledComponents/index';
import ExportToCsvComponent from './ExportToCsvComponent';
import AUTOSUGGEST_QUERY from 'queries/CrumbsSearchPageAggBucketsQuery';
import SaveSearch from './SaveSearch';
import LabeledButton from 'components/LabeledButton';
import {  SearchParams  as SearchParamsType }  from '../../../containers/SearchPage/shared';



const CrumbsBarStyleWrappper = styled.div`
  border: solid white 1px;
  // background-color: ${props => props.theme.crumbsBar.containerBackground};
  color: black;
  margin-left: 45px;
  margin-right: 45px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  .container {
    border: 0px;
    width: 100% !important;
    margin-top: 5px;
    color: #394149;
  }
  .crumbs-bar {
    // background: ${props => props.theme.crumbsBar.containerBackground};
    color: ${props => props.theme.crumbsBar.containerFont};

    i {
      font-style: normal;
      margin-right: 3px;
      text-transform: capitalize;
    }

    span.label.label-default {
      padding: 7px !important;
      border-radius: 4px !important;
      display: flex;
      flex-wrap: wrap;
    }

    input.form-control {
      border: 0px;
      box-shadow: none;
      margin-right: 10px;
      margin-left: 10px;
    }

    span.label {
      background: #55b88d;
      padding: 5px;
      font-size: 12px;
      border-radius: 4px;
      margin-right: 5px;
      text-transform: capitalize;

      span.fa-remove {
        color: #fff !important;
        opacity: 0.5;
        margin-left: 5px !important;
      }

      span.fa-remove:hover {
        opacity: 1;
      }

      b {
        padding: 5px 1px 5px 1px;
      }

      b:last-of-type {
        padding-right: 0px;
      }
    }
  }
  .right-align {
    text-align: right;
  }

  div.row > div {
    padding-left: 0px;
  }

  .searchInput {
    padding-bottom: 10px;
  }
`;

const ThemedCrumbsBarStyleWrappper = withTheme(CrumbsBarStyleWrappper);

const LoaderWrapper = styled.div`
  margin: 20px 20px;

  text-align: center;
`;

interface CrumbsBarProps {
  searchParams: SearchParams;
  onBulkUpdate: (hash: string, siteViewUrl: string) => void;
  removeFilter: AggCallback;
  addFilter: AggCallback;
  addSearchTerm: (term: string) => void;
  removeSearchTerm: (term: string, bool?) => void;
  onReset: () => void;
  onClear: () => void;
  siteViewUrl?: string;
  presentSiteView: PresentSiteFragment_siteView;
  totalResults: number;
  searchHash: string;
  theme: Theme;
  updateSearchParams: (params: SearchParamsType) => Promise<void>;
}

interface CrumbsBarState {
  searchTerm: string;
  suggestions: any;
  isSuggestionLoading: boolean;
  showFilters: boolean;
}

class CrumbsBar extends React.Component<CrumbsBarProps, CrumbsBarState> {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      suggestions: [],
      isSuggestionLoading: true,
      showFilters: true,
    };
  }


  *mkCrumbs(searchParams: SearchParams, thisSiteView) {
    if (!isEmpty(searchParams.q)) {
      yield (
        <MultiCrumb
          key="Search"
          category="search"
          values={searchParams.q}
          onClick={term => this.props.removeSearchTerm(term)}
        />
      );
    }
    let aggFilterCounter = 0;
    for (const key in searchParams.aggFilters) {
      const agg = searchParams.aggFilters[key];
      yield (
        <AggCrumb
          grouping="aggFilters"
          agg={agg}
          key={`aggFilters${aggFilterCounter++}`}
          thisSiteView={thisSiteView}
          searchParams={this.props.searchParams}
          updateSearchParams={this.props.updateSearchParams}
        />
      );
    }
    for (const key in searchParams.crowdAggFilters) {
      const agg = searchParams.crowdAggFilters[key];
      const cat = aggToField(agg.field, agg.field);
      yield (
        <AggCrumb
          grouping="crowdAggFilters"
          category={cat}
          values={agg.values}
          agg={agg}
          key={`crowdAggFilters${aggFilterCounter++}`}
          thisSiteView={thisSiteView}
          searchParams={this.props.searchParams}
          updateSearchParams={this.props.updateSearchParams}
        />
      );
    }
  }

  *mkDefaultClearButtons(searchParams: SearchParams) {
    const totalLength =
      searchParams.q?.length +
      searchParams.crowdAggFilters?.length +
      searchParams.aggFilters?.length;
    if (totalLength > 0) {
      yield (
        <span key="buttons">
          <ThemedButton
            key="defaul"
            onClick={this.props.onReset}
            style={{ margin: '5px 0px 5px 10px', border: '1px solid white' }}>
            Default
          </ThemedButton>
          <ThemedButton
            key="reset"
            onClick={this.props.onClear}
            style={{ margin: '5px 0px 5px 10px', border: '1px solid white' }}>
            Clear
          </ThemedButton>
        </span>
      );
    } else {
      yield (
        <ThemedButton
          key="defaul"
          onClick={this.props.onReset}
          style={{ margin: '5px 0px 5px 10px', border: '1px solid white' }}>
          Default
        </ThemedButton>
      );
    }
  }

  getAggFieldsFromSubsiteConfig = aggs => {
    let aggFields: string[] = [];
    if (aggs.length > 0) {
      aggs.map(i => {
        if (i.autoSuggest) {
          aggFields.push(i.name);
        }
      });
    }
    if (aggFields.length <= 0) {
      aggFields = [
        'browse_condition_mesh_terms',
        'browse_interventions_mesh_terms',
        'facility_countries',
      ];
    }
    return aggFields;
  };

  getCrowdAggAutoSuggest = () => {
    let crowdAggFields = displayFields(
      this.props.presentSiteView.search.autoSuggest.crowdAggs.selected.kind,
      this.props.presentSiteView.search.autoSuggest.crowdAggs.selected.values,
      this.props.presentSiteView.search.autoSuggest.crowdAggs.fields
    );
    let fieldsToReturn: any[] = [];
    crowdAggFields.map(field => {
      fieldsToReturn.push(field.name);
    });
    return fieldsToReturn;
  };

  getAutoSuggestFields = () => {
    let aggFields = displayFields(
      this.props.presentSiteView.search.autoSuggest.aggs.selected.kind,
      this.props.presentSiteView.search.autoSuggest.aggs.selected.values,
      this.props.presentSiteView.search.autoSuggest.aggs.fields
    );
    let fieldsToReturn: any[] = [];
    aggFields.map(field => {
      fieldsToReturn.push(field.name);
    });
    return fieldsToReturn;
  };

  queryAutoSuggest = async apolloClient => {
    const { searchTerm } = this.state;
    const { searchParams, presentSiteView } = this.props;
    const newParams = searchParams.q.map(i => {
      return { children: [], key: i };
    });

    const aggFields = this.getAutoSuggestFields();

    const crowdAggFields = this.getCrowdAggAutoSuggest();

    const query = AUTOSUGGEST_QUERY;
    const variables = {
      agg: 'browse_condition_mesh_terms',
      aggFilters: searchParams.aggFilters,
      aggOptionsFilter: searchTerm,
      crowdAggFilters: searchParams.crowdAggFilters,
      page: 0,
      pageSize: 5,
      url: presentSiteView.url,
      q: {
        children: newParams,
        key: 'AND',
      },
      sorts: [],
      aggFields: aggFields,
      crowdAggFields: crowdAggFields,
    };
    const response = await apolloClient.query({
      query,
      variables,
    });
    const array = response.data.autocomplete.autocomplete;
    this.setState({
      suggestions: array,
      isSuggestionLoading: false,
    });
  };

  onSuggestionsFetchRequested = () => {
    this.setState({
      isSuggestionLoading: true,
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
      isSuggestionLoading: true,
    });
  };

  getSuggestionValue = suggestion => {
    return suggestion.key;
  };
  renderAutoSuggest = (
    suggestions,
    searchTerm,
    apolloClient,
    showAutoSuggest,
    loading: boolean
  ) => {
    if (showAutoSuggest === true) {
      return (
        <div style={{ display: 'inline' }}>
          <FormGroup>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <b
                style={{
                  marginRight: '8px',
                  marginTop: '4px',
                }}>
                <ControlLabel>Search Within: </ControlLabel>{' '}
              </b>

              <Autosuggest
                multiSection={true}
                suggestions={suggestions}
                inputProps={{
                  value: searchTerm,
                  onChange: (e, searchTerm) =>
                    this.onChange(e, searchTerm, apolloClient),
                }}
                renderSuggestion={this.renderSuggestion}
                renderSuggestionsContainer={
                  loading ? this.renderSuggestionsContainer : undefined
                }
                renderSectionTitle={this.renderSectionTitle}
                getSectionSuggestions={this.getSectionSuggestions}
                onSuggestionSelected={this.onSuggestionSelected}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
              />
            </div>
          </FormGroup>
          <LabeledButton
          theType={"Submit"}
          helperText={"Search"}
          iconName={"search"}
       />
        </div>
      );
    } else if (showAutoSuggest === false) {
      return null;
    }
  };
  renderSuggestion = suggestion => {
    const capitalized = this.capitalize(suggestion.key);
    return <span>{`${capitalized} (${suggestion.docCount})`}</span>;
  };
  renderSuggestionsContainer = () => {
    const { isSuggestionLoading, suggestions } = this.state;

    if (isSuggestionLoading === true) {
      if (suggestions.length === 0) {
        return null;
      } else {
        return (
          <div className="react-autosuggest__suggestions-container--open">
            <LoaderWrapper>
              <BeatLoader color="#cccccc" />
            </LoaderWrapper>
          </div>
        );
      }
    }
  };

  getSectionSuggestions = section => {
    return section.results;
  };

  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  onSuggestionSelected = (event, { suggestionValue, sectionIndex }) => {
    const section = this.state.suggestions[sectionIndex];
    if (section.isCrowd) {
      this.props.addFilter(section.name, suggestionValue, true);
    } else this.props.addFilter(section.name, suggestionValue);
  };

  renderSectionTitle = section => {
    if (section.results.length > 0) {
      let newName = aggToField(section.name, section.name);
      newName = this.capitalize(newName);
      return <strong>{newName}</strong>;
    } else return null;
  };

  onChange = (e, { newValue }, apolloClient) => {
    this.setState(
      {
        searchTerm: newValue,
      },
      () => {
        this.queryAutoSuggest(apolloClient);
      }
    );
  };

  clearPrimarySearch = () => {
    this.props.removeSearchTerm('', true);
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.addSearchTerm(this.state.searchTerm);
    this.setState({ searchTerm: '' });
  };

  toggleShowFilters = () => {
    this.setState({ showFilters: !this.state.showFilters });
  };

  showSaveSearchButton = (user) => {
    const {searchParams } = this.props;
    if (
      searchParams.q &&
      searchParams.aggFilters &&
      searchParams.crowdAggFilters
    ){
      if (
        searchParams.q.length != 0 ||
        searchParams.aggFilters.length != 0 ||
        searchParams.crowdAggFilters.length != 0
      ) {
        return (
          <SaveSearch
            user={user}
            siteView={this.props.presentSiteView}
            searchHash={this.props.searchHash}
          />
        );
      } 
     return null
    }
    return null
  }


  render() {
    const { searchTerm, suggestions, isSuggestionLoading } = this.state;
    const { presentSiteView, searchParams } = this.props;
    
    let showCrumbsBar = presentSiteView.search.config.fields.showBreadCrumbs;
    let showAutoSuggest = presentSiteView.search.config.fields.showAutoSuggest;
    return (
        <ApolloConsumer>
          {apolloClient => (
            <CurrentUser>
              {user => (
                <Grid className="crumbs-bar">
                  {showCrumbsBar ? (
                    <Row>
                      <Col
                        md={12}
                        style={{
                          padding: '10px 0px',
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}>
                        <ListGroup
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            background: '#fff',
                            width: '100%',
                          }}>
                          <ListGroupItem
                            style={{
                              minWidth: '100%',
                              background: this.props.theme.button,
                              color: '#fff',
                            }}>
                            {presentSiteView.search.crumbs.search ? (
                              <Form
                                inline
                                className="searchInput"
                                onSubmit={this.onSubmit}
                                style={{ color: 'black', display: 'inline' }}>
                                {this.renderAutoSuggest(
                                  suggestions,
                                  searchTerm,
                                  apolloClient,
                                  showAutoSuggest,
                                  isSuggestionLoading
                                )}
                              </Form>
                            ) : null}{' '}
                            {Array.from(
                              this.mkDefaultClearButtons(
                                this.props.searchParams
                              )
                            )}
                          </ListGroupItem>
                          {this.state.showFilters
                            ? Array.from(
                                this.mkCrumbs(
                                  this.props.searchParams,
                                  presentSiteView
                                )
                              )
                            : null}{' '}
                        </ListGroup>
                      </Col>
                    </Row>
                  ) : null}
                  <Row>
                    <Col xs={12}>
                      <div style={{ marginRight: '10px', display: 'inline' }}>
                        <b>Total Results:</b>{' '}
                        {`${this.props.totalResults} studies`}
                      </div>
                      {
                        this.showSaveSearchButton(user)
                      }
                      <ExportToCsvComponent
                        siteView={this.props.presentSiteView}
                        searchHash={this.props.searchHash}
                      />
                      {user && user.roles.includes('admin') ? (
                        <ThemedButton
                          onClick={() =>
                            this.props.onBulkUpdate(
                              this.props.searchHash,
                              this.props.presentSiteView.url || 'default'
                            )
                          }
                          style={{ marginLeft: '10px' }}>
                          Bulk Update <FontAwesome name="truck" />
                        </ThemedButton>
                      ) : null}
                    </Col>
                  </Row>
                </Grid>
              )}
            </CurrentUser>
          )}
        </ApolloConsumer>
    );
  }
}

export default withTheme(CrumbsBar);
