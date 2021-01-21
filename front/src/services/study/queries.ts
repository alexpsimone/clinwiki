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

export const FACILITY_FRAGMENT = `
  fragment FacilityFragment on Facility {
    city
    country
    id
    name
    nctId
    state
    status
    location {
      latitude
      longitude
      status
    }
    zip
    contacts {
      contactType
      email
      id
      name
      nctId
      phone
    }
  }
`;
export const FACILITIES_PAGE_QUERY =`
query FacilitiesPageQuery($nctId: String!) {
  study(nctId: $nctId) {
    facilities {
      ...FacilityFragment
    }
    nctId
  }
  me {
    id
  }
}

${FACILITY_FRAGMENT}
`;

