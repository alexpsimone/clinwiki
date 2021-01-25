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

export const STUDY_EDITS_HISTORY_QUERY = `
  query StudyEditsHistoryQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        edits {
          id
          createdAt
          changeSet {
            frontMatterChanged
            bodyChanged
            editLines {
              body
              content
              frontMatter
              status
            }
          }
          comment
          diff
          diffHtml
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`;

