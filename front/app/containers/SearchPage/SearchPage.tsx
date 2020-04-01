import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import {
  SearchPageHashQuery,
  SearchPageHashQueryVariables,
} from 'types/SearchPageHashQuery';
import {
  SearchPageParamsQuery,
  SearchPageParamsQueryVariables,
  SearchPageParamsQuery_searchParams,
} from 'types/SearchPageParamsQuery';
import { MAX_WINDOW_SIZE } from 'utils/constants';
import { SearchParams, AggKind, SearchQuery } from './shared';
import SearchStudyPage from 'containers/SearchStudyPage';
import BulkEditPage from 'containers/BulkEditPage';
import { Query, ApolloConsumer } from 'react-apollo';
import {
  path,
  map,
  filter,
  dissoc,
  pathOr,
  prop,
  any,
  pipe,
  groupBy,
  head,
  propOr,
  lensPath,
  over,
  findIndex,
  propEq,
  reject,
  isEmpty,
  view,
  remove,
  equals,
  props,
} from 'ramda';
import SearchView from './SearchView';
import CrumbsBar from './components/CrumbsBar';
import { AggFilterInput, SortInput } from 'types/globalTypes';
import Aggs from './components/Aggs';
import {
  SearchPageSearchQuery_search_aggs,
  SearchPageSearchQuery_search_aggs_buckets,
  SearchPageSearchQuery_crowdAggs_aggs,
  SearchPageSearchQuery_search_studies,
} from 'types/SearchPageSearchQuery';
import { AggBucketMap } from './Types';
import SiteProvider from 'containers/SiteProvider';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { preselectedFilters } from 'utils/siteViewHelpers';
import { stack as Menu } from 'react-burger-menu';
import { match } from 'react-router';

const HASH_QUERY = gql`
  query SearchPageHashQuery(
    $q: SearchQueryInput!
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int
    $pageSize: Int
  ) {
    searchHash(
      params: {
        q: $q
        sorts: $sorts
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        page: $page
        pageSize: $pageSize
      }
    )
  }
`;

export const PARAMS_QUERY = gql`
  query SearchSearchPageParamsQuery($hash: String) {
    searchParams(hash: $hash) {
      q
      sorts {
        id
        desc
      }
      aggFilters {
        field
        values
      }
      crowdAggFilters {
        field
        values
      }
      page
      pageSize
    }
  }
`;

class HashQueryComponent extends Query<
  SearchPageHashQuery,
  SearchPageHashQueryVariables
> {}
class ParamsQueryComponent extends Query<
  SearchPageParamsQuery,
  SearchPageParamsQueryVariables
> {}

const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;
  float: left;
  width: 100%;

  .rt-th {
    text-transform: capitalize;
    padding: 15px !important;
    background: #8bb7a4 !important;
    color: #fff;
  }

  .rt-table {
  }
`;

const SidebarContainer = styled(Col)`
  padding-right: 0px !important;
  padding-top: 10px;
  box-sizing: border-box;
  .panel-title {
    a:hover {
      text-decoration: none;
      color: #fff;
    }
  }
  .panel-default {
    box-shadow: 0px;
    border: 0px;
    background: none;
    color: #fff;
    text-transform: capitalize;
    .panel-heading {
      box-shadow: 0px;
      border: 0px;
      background: none;
      color: #fff;
      text-transform: capitalize;
    }
    .panel-collapse {
      background: #394149;
      .panel-body {
        padding-left: 10px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    .panel-title {
      font-size: 16px;
      color: #bac5d0;
      padding: 0px 10px;
    }
  }
`;

const SearchContainer = styled.div`
  border: solid white 1px;
  background-color: #f2f2f2;
  color: black;
  margin-bottom: 1em;
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const InstructionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
`;
const Instructions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const changeFilter = (add: boolean) => (
  aggName: string,
  key: string,
  isCrowd?: boolean
) => (params: SearchParams) => {
  const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
  const lens = lensPath([propName]);
  return over(
    lens,
    (aggs: AggFilterInput[]) => {
      const index = findIndex(propEq('field', aggName), aggs);
      if (index === -1 && add) {
        return [...aggs, { field: aggName, values: [key] }];
      }
      const aggLens = lensPath([index, 'values']);
      const updater = (values: string[]) =>
        add ? [...values, key] : reject(x => x === key, values);
      let res = over(aggLens, updater, aggs);
      // Drop filter if no values left
      if (isEmpty(view(aggLens, res))) {
        res = remove(index, 1, res as any);
      }
      return res;
    },
    {
      ...params,
      page: 0,
    }
  );
};
const addFilter = changeFilter(true);
const removeFilter = changeFilter(false);
const addFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
  return (params: SearchParams) => {
    keys.forEach(k => {
      (params = addFilter(aggName, k, isCrowd)(params) as SearchParams),
        console.log(k);
    });
    // changeFilter(true);
    return params;
  };
};

const removeFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
  return (params: SearchParams) => {
    keys.forEach(k => {
      params = removeFilter(aggName, k, isCrowd)(params) as SearchParams;
    });
    // changeFilter(true);
    return params;
  };
};

const addSearchTerm = (term: string) => (params: SearchParams) => {
  // have to check for empty string because if you press return two times it ends up putting it in the terms
  if (!term.replace(/\s/g, '').length) {
    return params;
  }
  // recycled code for removing repeated terms. might be a better way but I'm not sure.
  const children = reject(propEq('key', term), params.q.children || []);
  return {
    ...params,
    q: { ...params.q, children: [...(children || []), { key: term }] },
    page: 0,
  };
};

const removeSearchTerm = (term: string) => (params: SearchParams) => {
  const children = reject(
    propEq('key', term),
    params.q.children || []
  ) as SearchQuery[];
  return {
    ...params,
    q: { ...params.q, children },
    page: 0,
  };
};

const changePage = (pageNumber: number) => (params: SearchParams) => ({
  ...params,
  page: Math.min(pageNumber, Math.ceil(MAX_WINDOW_SIZE / params.pageSize) - 1),
});

interface SearchPageProps {
  match: any;
  history: any;
  ignoreUrlHash?: boolean | null;
  searchParams?: SearchParams;
  userId?: string;
  profileParams?: any;
}

interface SearchPageState {
  params: SearchParams | null;
  openedAgg: {
    name: string;
    kind: AggKind;
  } | null;
  searchAggs: AggBucketMap;
  searchCrowdAggs: AggBucketMap;
  showCards: Boolean;
  removeSelectAll: boolean;
  totalRecords: number;
  siteViewType: string;
}

const DEFAULT_PARAMS: SearchParams = {
  q: { key: 'AND', children: [] },
  aggFilters: [],
  crowdAggFilters: [],
  sorts: [],
  page: 0,
  pageSize: 25,
};

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  state: SearchPageState = {
    params: null,
    openedAgg: null,
    searchAggs: {},
    searchCrowdAggs: {},
    showCards: localStorage.getItem('showCards') === 'true' ? true : false,
    removeSelectAll: false,
    totalRecords: 0,
    siteViewType: '',
  };

  numberOfPages: number = 0;
  returnNumberOfPages = (numberOfPg: number) => {
    this.numberOfPages = numberOfPg;
  };

  static getDerivedStateFromProps(
    props: SearchPageProps,
    state: SearchPageState
  ) {
    // if (props.userId) {
    //   return {
    //     params: props.searchParams || DEFAULT_PARAMS,
    //   };
    // }
    if (state.params == null && props.ignoreUrlHash) {
      return {
        params: props.searchParams || DEFAULT_PARAMS,
        openedAgg: null,
      };
    }
    return null;
  }

  toggledShowCards = (showCards: Boolean) => {
    localStorage.setItem('showCards', showCards.toString());
    const params: any = { ...this.state.params, page: 0 };
    this.previousSearchData = [];
    this.setState({ showCards, params });
    // console.log('ToggleShowParams', params);
    // console.log('LocalStorage', localStorage.getItem('showCards'));
  };

  previousSearchData: Array<SearchPageSearchQuery_search_studies> = [];
  returnPreviousSearchData = (
    previousSearchData: Array<SearchPageSearchQuery_search_studies>
  ) => {
    this.previousSearchData = previousSearchData;
  };

  getDefaultParams = (view: SiteViewFragment) => {
    if (this.props.userId) {
      // console.log(
      //   'this should make the correct obj',
      //   this.props.profileParams,
      //   preselectedFilters(view)
      // );
      const profileViewParams = this.props.profileParams;
      // const siteFilters = preselectedFilters(view);
      // this.props.profileParams.push(siteFilters.aggFilters)

      return { ...profileViewParams, ...preselectedFilters(view) };
    }
    console.log(
      'this should make the correct obj',
      DEFAULT_PARAMS,
      preselectedFilters(view)
    );
    return {
      ...DEFAULT_PARAMS,
      ...preselectedFilters(view),
    };
  };

  searchParamsFromQuery = (
    view: SiteViewFragment,
    params: SearchPageParamsQuery_searchParams | null | undefined
  ): SearchParams => {
    const defaultParams = this.getDefaultParams(view);
    console.log('default params', defaultParams);
    if (!params) return defaultParams;

    const q = params.q
      ? (JSON.parse(params.q) as SearchQuery)
      : defaultParams.q;

    const aggFilters = map(
      dissoc('__typename'),
      params.aggFilters || []
    ) as AggFilterInput[];
    const crowdAggFilters = map(
      dissoc('__typename'),
      params.crowdAggFilters || []
    ) as AggFilterInput[];
    const sorts = map(dissoc('__typename'), params.sorts || []) as SortInput[];
    console.log('aggfilters', aggFilters);
    return {
      aggFilters,
      crowdAggFilters,
      sorts,
      q,
      page: params.page || 0,
      pageSize: params.pageSize || 25,
    };
  };

  transformFilters = (
    filters: AggFilterInput[]
  ): { [key: string]: Set<string> } => {
    return pipe(
      groupBy(prop('field')),
      map(head),
      map(propOr([], 'values')),
      map(arr => new Set(arr))
    )(filters) as { [key: string]: Set<string> };
  };

  transformAggs = (
    aggs: SearchPageSearchQuery_search_aggs[]
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    return pipe(
      groupBy(prop('name')),
      map(head),
      map(prop('buckets'))
    )(aggs) as { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] };
  };

  transformCrowdAggs = (
    aggs: SearchPageSearchQuery_crowdAggs_aggs[]
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    // @ts-ignore
    return pipe(head, prop('buckets'), groupBy(prop('key')))(aggs) as {
      [key: string]: SearchPageSearchQuery_search_aggs_buckets[];
    };
  };

  handleResetFilters = (view: SiteViewFragment) => () => {
    this.setState({
      params: this.getDefaultParams(view),
      removeSelectAll: true,
    });
  };

  handleClearFilters = () => {
    this.setState({
      params: DEFAULT_PARAMS,
      removeSelectAll: true,
    });
  };

  resetSelectAll = () => {
    this.setState({
      removeSelectAll: false,
    });
  };

  handleUpdateParams = (updater: (params: SearchParams) => SearchParams) => {
    const params = updater(this.state.params!);
    console.log('updatedParams', params);
    this.previousSearchData = [];
    if (!equals(params.q, this.state.params && this.state.params.q)) {
      // For now search doesn't work well with args list
      // Therefore we close it to refresh later on open
      this.setState({ openedAgg: null });
    }

    this.setState({ params });
  };

  isWorkflow = () => {
    return pipe(
      pathOr([], ['params', 'crowdAggFilters']),
      map(prop('field')),
      // @ts-ignore
      any(x => (x as string).toLowerCase().includes('wf_'))
    )(this.state);
  };

  handleRowClick = (nctId: string) => {
    const suffix =
      this.isWorkflow() && !this.props.ignoreUrlHash ? '/workflow' : '';
    const prefix = this.props.ignoreUrlHash ? '' : this.props.match.url;
    this.props.history.push(`${prefix}/study/${nctId}${suffix}`);
  };

  handleBulkUpdateClick = () => {
    this.props.history.push(`${this.props.match.url}/bulk`);
  };

  handleOpenAgg = (name: string, kind: AggKind) => {
    if (!this.state.openedAgg) {
      this.setState({ openedAgg: { name, kind } });
      return;
    }
    // @ts-ignore
    const { name: currentName, kind: currentKind } = this.state.openedAgg;
    if (name === currentName && kind === currentKind) {
      this.setState({ openedAgg: null });
      return;
    }

    this.setState({ openedAgg: { name, kind } });
  };

  handleAggsUpdate = (
    searchAggs: AggBucketMap,
    searchCrowdAggs: AggBucketMap
  ) => {
    if (
      !equals(searchAggs, this.state.searchAggs) ||
      !equals(searchCrowdAggs, this.state.searchCrowdAggs)
    ) {
      this.setState({ searchAggs, searchCrowdAggs });
    }
  };

  renderAggs = siteView => {
    const opened = this.state.openedAgg && this.state.openedAgg.name;
    const openedKind = this.state.openedAgg && this.state.openedAgg.kind;
    const { aggFilters = [], crowdAggFilters = [] } = this.state.params || {};
    // this.searchParamsFromQuery();
    return (
      <Aggs
        aggs={this.state.searchAggs}
        crowdAggs={this.state.searchCrowdAggs}
        filters={this.transformFilters(aggFilters)}
        crowdFilters={this.transformFilters(crowdAggFilters)}
        addFilter={pipe(addFilter, this.handleUpdateParams)}
        addFilters={pipe(addFilters, this.handleUpdateParams)}
        removeFilter={pipe(removeFilter, this.handleUpdateParams)}
        removeFilters={pipe(removeFilters, this.handleUpdateParams)}
        updateParams={this.handleUpdateParams}
        removeSelectAll={this.state.removeSelectAll}
        resetSelectAll={this.resetSelectAll}
        // @ts-ignore
        searchParams={this.state.params}
        opened={opened}
        openedKind={openedKind}
        onOpen={this.handleOpenAgg}
        currentSiteView={siteView}
      />
    );
  };

  renderSearch = (
    hash: string | null,
    view: SiteViewFragment,
    siteViews: SiteViewFragment[]
  ) => {
    return (
      <ParamsQueryComponent
        query={PARAMS_QUERY}
        variables={{ hash }}
        onCompleted={(data: any) => {
          if (!this.state.params) {
            const params: SearchParams = this.searchParamsFromQuery(
              view,
              data && data.searchParams
            );
            this.setState({
              params: {
                ...params,
                page: 0,
                pageSize: 25,
              },
            });
            return null;
          }
        }}>
        {({ data, loading, error }) => {
          if (error || loading) return null;

          const params: SearchParams = this.searchParamsFromQuery(
            view,
            data && data.searchParams
          );
          console.log('params', params);
          // hydrate state params from hash
          if (!this.state.params) {
            this.setState({ params });
            return null;
          }
          const opened = this.state.openedAgg && this.state.openedAgg.name;
          const openedKind = this.state.openedAgg && this.state.openedAgg.kind;
          const { aggFilters = [], crowdAggFilters = [] } =
            this.state.params || {};
          // current site view url should match w/one of the site views url
          const checkUrls = () => {
            if (this.state.siteViewType != 'user') {
              return filter(
                siteViews =>
                  siteViews.url == this.props.match.params.siteviewUrl,
                //siteViews => siteViews.url == "default",
                siteViews
              );
            }
            return filter(siteViews => siteViews.url == 'user', siteViews);
          };

          const siteViewUrl = () => {
            if (checkUrls().length === 1) {
              if (this.state.siteViewType !== 'user') {
                console.log('PARAMS', this.props.match.params);
                let url: any[] = checkUrls();
                console.log('URL', url[0].url);
                let siteUrl = url[0].url;

                return siteUrl;
              }
              return 'user';
            }
            console.log('Check urls !==1');
            return 'default';
          };

          // console.log("SViewURL1", siteViewUrl())
          return (
            <HashQueryComponent
              query={HASH_QUERY}
              variables={this.state.params || undefined}>
              {({ data, loading, error }) => {
                if (error || loading || !data) return null;
                // We have a mismatch between url and params in state
                if (data.searchHash !== hash) {
                  if (this.state.siteViewType !== 'user') {
                    return (
                      <Redirect
                        to={`/search/${siteViewUrl()}/${data.searchHash}`}
                      />
                    );
                  }
                }

                return (
                  <SearchView
                    params={params}
                    onBulkUpdate={this.handleBulkUpdateClick}
                    openedAgg={this.state.openedAgg}
                    onUpdateParams={this.handleUpdateParams}
                    onRowClick={this.handleRowClick}
                    onOpenAgg={this.handleOpenAgg}
                    onAggsUpdate={this.handleAggsUpdate}
                    onResetFilters={this.handleResetFilters(view)}
                    onClearFilters={this.handleClearFilters}
                    previousSearchData={this.previousSearchData}
                    returnPreviousSearchData={this.returnPreviousSearchData}
                    searchHash={data.searchHash}
                    showCards={this.state.showCards}
                    toggledShowCards={this.toggledShowCards}
                    returnNumberOfPages={this.returnNumberOfPages}
                    siteViewUrl={siteViewUrl()}
                    searchAggs={this.state.searchAggs}
                    crowdAggs={this.state.searchCrowdAggs}
                    transformFilters={this.transformFilters}
                    removeSelectAll={this.state.removeSelectAll}
                    resetSelectAll={this.resetSelectAll}
                    searchParams={this.state.params}
                    opened={opened}
                    openedKind={openedKind}
                    onOpen={this.handleOpenAgg}
                    currentSiteView={view}
                    getTotalResults={this.getTotalResults}
                  />
                );
              }}
            </HashQueryComponent>
          );
        }}
      </ParamsQueryComponent>
    );
  };

  handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 &&
      this.state.params!.page < this.numberOfPages - 1 &&
      this.state.showCards
    ) {
      window.removeEventListener('scroll', this.handleScroll);

      const params: any = {
        ...this.state.params,
        page: this.state.params!.page + 1,
      };
      this.setState({ params });

      setTimeout(() => {
        window.addEventListener('scroll', this.handleScroll);
      }, 1000);

      return null;
    }
  };

  componentDidMount() {
    if (this.state.showCards) {
      window.addEventListener('scroll', this.handleScroll);
    } else {
      window.removeEventListener('scroll', this.handleScroll);
    }
    if (this.props.userId) {
      this.setState({
        siteViewType: 'user',
      });
    } else {
      this.setState({
        siteViewType: 'search',
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate() {
    if (this.state.showCards) {
      window.addEventListener('scroll', this.handleScroll);
    } else {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  getTotalResults = total => {
    if (total) {
      this.setState({
        totalRecords: total,
      });
    }
    return null;
  };

  renderPresearch = hash => {
    const { aggFilters = [], crowdAggFilters = [] } = this.state.params || {};
    return (
      <SiteProvider>
        {site => {
          const siteViewUrl = this.props.match.params.siteviewUrl;
          const siteViews = site.siteViews;
          let thisSiteView =
            siteViews.find(
              siteview =>
                //@ts-ignore
                siteview.url.toLowerCase() == siteViewUrl.toLowerCase()
            ) || site.siteView;
          const preSearchAggs =
            thisSiteView.search.presearch.aggs.selected.values;
          const preSearchCrowdAggs =
            thisSiteView.search.presearch.crowdAggs.selected.values;
          const presearchButton = thisSiteView.search.presearch.button;
          const presearchInstructions =
            thisSiteView.search.presearch.instructions;
          const presearchText = thisSiteView.search.presearch.instructions;
          return (
            <SearchContainer>
              <InstructionsContainer>
                {presearchText && (
                  <Instructions>
                    {/* <h4 style={{ marginRight: 10 }}>Instructions:</h4>{' '} */}
                    <h5>{presearchText}</h5>
                  </Instructions>
                )}
              </InstructionsContainer>
              <Aggs
                aggs={this.state.searchAggs}
                crowdAggs={this.state.searchCrowdAggs}
                filters={this.transformFilters(aggFilters)}
                crowdFilters={this.transformFilters(crowdAggFilters)}
                addFilter={pipe(addFilter, this.handleUpdateParams)}
                addFilters={pipe(addFilters, this.handleUpdateParams)}
                removeFilter={pipe(removeFilter, this.handleUpdateParams)}
                removeFilters={pipe(removeFilters, this.handleUpdateParams)}
                updateParams={this.handleUpdateParams}
                removeSelectAll={this.state.removeSelectAll}
                resetSelectAll={this.resetSelectAll}
                // @ts-ignore
                searchParams={this.state.params}
                presearch
                preSearchAggs={preSearchAggs}
                preSearchCrowdAggs={preSearchCrowdAggs}
                currentSiteView={thisSiteView}
              />
              {presearchButton.name && (
                <Button
                  style={{ width: 200, marginLeft: 13 }}
                  href={`/search/${presearchButton.target}/${hash}`}>
                  {presearchButton.name}
                </Button>
              )}
            </SearchContainer>
          );
        }}
      </SiteProvider>
    );
  };

  renderCrumbs = siteView => {
    const { params } = this.state;
    console.log('renderCrumbs', this.state.params);
    // if (this.props.userId) {
    //   this.getDefaultParams(siteView);
    // }
    const q =
      this.state.params?.q.key === '*'
        ? []
        : (this.state.params?.q.children || []).map(prop('key'));
    return (
      <SiteProvider>
        {site => {
          const siteViewUrl = () => {
            //note about this if block at Line 928
            if (
              this.state.siteViewType !== 'user' &&
              this.state.siteViewType !== ''
            ) {
              return this.props.match.params.siteviewUrl;
            }
            return 'user';
          };
          const siteViews = site.siteViews;
          let currentSiteView =
            siteViews.find(
              siteview =>
                //@ts-ignore
                siteview.url.toLowerCase() == siteViewUrl().toLowerCase()
            ) || site.siteView;

          return (
            <CrumbsBar
              siteViewUrl={siteViewUrl()}
              //@ts-ignore
              searchParams={{ ...this.state.params, q }}
              onBulkUpdate={this.handleBulkUpdateClick}
              removeFilter={pipe(removeFilter, this.handleUpdateParams)}
              addSearchTerm={pipe(addSearchTerm, this.handleUpdateParams)}
              removeSearchTerm={pipe(removeSearchTerm, this.handleUpdateParams)}
              pageSize={params?.pageSize || 25}
              update={{
                page: pipe(changePage, this.handleUpdateParams),
              }}
              data={site}
              onReset={this.handleResetFilters(currentSiteView)}
              onClear={this.handleClearFilters}
              showCards={this.state.showCards}
              addFilter={pipe(addFilter, this.handleUpdateParams)}
              currentSiteView={currentSiteView}
              totalResults={this.state.totalRecords}
            />
          );
        }}
      </SiteProvider>
    );
  };

  render() {
    console.log('SP Props', this.props);
    const opened = this.state.openedAgg && this.state.openedAgg.name;
    const openedKind = this.state.openedAgg && this.state.openedAgg.kind;
    if (this.props.ignoreUrlHash) {
      return (
        <SiteProvider>
          {site => {
            const siteViewUrl = () => {
              if (this.state.siteViewType !== 'user') {
                return this.props.match.params.siteviewUrl;
              }
              return 'user';
            };
            const siteViews = site.siteViews;
            let thisSiteView =
              //@ts-ignore
              siteViews.find(
                siteview =>
                  //@ts-ignore
                  siteview.url.toLowerCase() == siteViewUrl().toLowerCase()
              ) || site.siteView;
            site.siteView;
            if (siteViewUrl() === 'default') {
              thisSiteView = site.siteView;
            }
            // console.log(thisSiteView);
            return (
              <Row>
                <SidebarContainer md={2}>
                  {this.renderAggs(thisSiteView)}
                </SidebarContainer>
                <MainContainer md={10}>
                  {this.renderPresearch(null)}
                  <SearchView
                    params={this.state.params as any}
                    onBulkUpdate={this.handleBulkUpdateClick}
                    openedAgg={this.state.openedAgg}
                    onUpdateParams={this.handleUpdateParams}
                    onRowClick={this.handleRowClick}
                    onOpenAgg={this.handleOpenAgg}
                    onAggsUpdate={this.handleAggsUpdate}
                    onResetFilters={this.handleResetFilters(thisSiteView)}
                    onClearFilters={this.handleClearFilters}
                    previousSearchData={this.previousSearchData}
                    returnPreviousSearchData={() =>
                      this.returnPreviousSearchData
                    }
                    searchHash={''}
                    showCards={this.state.showCards}
                    toggledShowCards={this.toggledShowCards}
                    returnNumberOfPages={this.returnNumberOfPages}
                    siteViewUrl={siteViewUrl()}
                    searchAggs={this.state.searchAggs}
                    crowdAggs={this.state.searchCrowdAggs}
                    transformFilters={this.transformFilters}
                    removeSelectAll={this.state.removeSelectAll}
                    resetSelectAll={this.resetSelectAll}
                    searchParams={this.state.params}
                    opened={opened}
                    openedKind={openedKind}
                    onOpen={this.handleOpenAgg}
                    currentSiteView={thisSiteView}
                    getTotalResults={this.getTotalResults}
                  />
                </MainContainer>
              </Row>
            );
          }}
        </SiteProvider>
      );
    }

    const hash = path(['match', 'params', 'searchId'], this.props) as
      | string
      | null;
    let siteViewType = this.state.siteViewType;

    return (
      <Switch>
        <Route
          path={`${this.props.match.path}/study/:nctId`}
          component={SearchStudyPage}
        />
        <Route
          path={`${this.props.match.path}/bulk/`}
          component={BulkEditPage}
        />
        <Route
          render={() => (
            <SiteProvider>
              {site => {
                const siteViewUrl = () => {
                  /*------
            console.log("S-Type", siteViewType)
            siteViewType coming back as an empty string when coming from Link in WikiEdits 
            Seems like the component isn't remounting (or updating as I tried to handle in componentDidUpdate but no dice) 
            so it never gets set to either user or search
      
            below if statement only use to handle siteViewType !=="user" so it incorrectly fall in there
            --------*/
                  if (siteViewType !== 'user' && siteViewType !== '') {
                    return this.props.match.params.siteviewUrl;
                  }
                  return 'user';
                };
                const siteViews = site.siteViews;
                let currentSiteView =
                  //@ts-ignore
                  siteViews.find(
                    siteview =>
                      //@ts-ignore
                      siteview.url.toLowerCase() == siteViewUrl().toLowerCase()
                  ) || site.siteView;

                if (siteViewUrl() === 'default') {
                  currentSiteView = site.siteView;
                }
                if (!currentSiteView) {
                  return <div>Error loading data.</div>;
                }
                const {
                  showPresearch,
                  showFacetBar,
                  showBreadCrumbs,
                } = currentSiteView.search.config.fields;
                return (
                  <Row>
                    {showFacetBar && (
                      <SidebarContainer md={2}>
                        {this.renderAggs(currentSiteView)}
                      </SidebarContainer>
                    )}
                    <div id="main_search" style={{ overflowY: 'auto' }}>
                      <MainContainer style={{ width: '100%' }}>
                        {showBreadCrumbs && this.renderCrumbs(currentSiteView)}
                        {showPresearch && this.renderPresearch(hash)}
                        {this.renderSearch(
                          hash,
                          currentSiteView,
                          site.siteViews
                        )}
                      </MainContainer>
                    </div>
                  </Row>
                );
              }}
            </SiteProvider>
          )}
        />
      </Switch>
    );
  }
}

export default SearchPage;
