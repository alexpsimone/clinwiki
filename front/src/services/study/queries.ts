export const PAGE_VIEW_FRAGMENT = `
fragment PageViewFragment on PageView {
    id
    pageType
    template
    title
    url
    default
  }
`;
export const PAGE_VIEWS_QUERY = `
  query PageViewsQuery($id: Int) {
    site(id: $id) {
      id
      pageViews {
        ...PageViewFragment
      }
    }
  }
  ${PAGE_VIEW_FRAGMENT}
`;


export const PAGE_VIEW_QUERY = `
  query PageViewQuery($id: Int, $url: String) {
    site(id: $id) {
      id
      pageView(url: $url) {
        ...PageViewFragment
      }
    }
  }
  ${PAGE_VIEW_FRAGMENT}
`;

export const SEARCH_STUDY_PAGE_QUERY =`
query SearchStudyPageQuery($hash: String!, $id: String!) {
  search(searchHash: $hash) {
    studyEdge(id: $id) {
      nextId
      prevId
      firstId
      lastId
      isWorkflow
      workflowName
      study {
        nctId
      }
      recordsTotal
      counterIndex
      firstId
      lastId
    }
  }
}
`;
