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


export const WORKFLOW_PAGE_QUERY = `
  query WorkflowPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        nctId
        meta
        content
      }
      nctId
    }
  }
`;

export const FRAGMENT = `
  fragment CrowdPageFragment on WikiPage {
    nctId
    meta
  }
`;
export const STUDY_SUMMARY_FRAGMENT = `
  fragment StudySummaryFragment on Study {
    acronym
    ages
    averageRating
    baselinePopulation
    biospecDescription
    biospecRetention
    briefSummary
    briefTitle
    collaborators
    completionDate
    completionDateType
    completionMonthYear
    conditions
    contacts
    createdAt
    detailedDescription
    dislikesCount
    dispositionFirstPostedDate
    dispositionFirstPostedDateType
    dispositionFirstSubmittedDate
    dispositionFirstSubmittedQcDate
    eligibilityCriteria
    eligibilityGender
    eligibilityHealthyVolunteers
    enrollment
    enrollmentType
    expandedAccessTypeIndividual
    expandedAccessTypeIntermediate
    expandedAccessTypeTreatment
    firstReceivedDate
    hasDataMonitoringCommittee
    hasDmc
    hasExpandedAccess
    investigators
    ipdAccessCriteria
    ipdTimeFrame
    ipdUrl
    isFdaRegulated
    isFdaRegulatedDevice
    isFdaRegulatedDrug
    isPpsd
    isUnapprovedDevice
    isUsExport
    lastChangedDate
    lastKnownStatus
    lastUpdatePostedDate
    lastUpdatePostedDateType
    lastUpdateSubmittedDate
    lastUpdateSubmittedQcDate
    likesCount
    limitationsAndCaveats
    listedLocationCountries
    nctId
    nlmDownloadDateDescription
    numberOfArms
    numberOfGroups
    officialTitle
    otherStudyIds
    overallStatus
    phase
    planToShareIpd
    planToShareIpdDescription
    primaryCompletionDate
    primaryCompletionDateType
    primaryCompletionMonthYear
    primaryMeasures
    publications
    removedLocationCountries
    responsibleParty
    resultsFirstPostedDate
    resultsFirstPostedDateType
    resultsFirstSubmittedDate
    resultsFirstSubmittedQcDate
    reviewsCount
    reactionsCount {
      name
      count
    }
    secondaryMeasures
    source
    sponsor
    startDate
    startDateType
    startMonthYear
    studyArms
    studyFirstPostedDate
    studyFirstPostedDateType
    studyFirstSubmittedDate
    studyFirstSubmittedQcDate
    studyType
    studyViewCount
    targetDuration
    type
    updatedAt
    verificationDate
    verificationMonthYear
    whyStopped
}
`;
export const CROWD_PAGE_QUERY = `
  query CrowdPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      wikiPage {
        ...CrowdPageFragment
      }
      nctId
    }
    me {
      id
    }
  }
  ${STUDY_SUMMARY_FRAGMENT}
  ${FRAGMENT}
`;
export const SUGGESTED_LABELS_QUERY = `
query SuggestedLabelsQuery($nctId: String!, $crowdBucketsWanted: [String!]) {
  crowdAggFacets(crowdBucketsWanted: $crowdBucketsWanted) { 
    aggs {
      name
      buckets {
        key
        keyAsString
        docCount
      }
    }
  }
  study(nctId: $nctId) {
    nctId
    wikiPage {
      nctId
      meta
    }
  }
}
`;

const WORKFLOW_VIEW_PROVIDER_FRAGMENT = `
  fragment WorkflowsViewFragment on WorkflowsView {
    id
    workflows {
      ...WorkflowConfigFragment
    }
  }
  fragment WorkflowConfigFragment on WorkflowConfig {
    allSuggestedLabels
    allWikiSections
    allSummaryFields
    disableAddRating
    hideReviews
    name
    summaryTemplate
    suggestedLabelsFilter {
      kind
      values
    }
    suggestedLabelsConfig {
      name
      rank
      display
      order {
        desc
        sortKind
      }
      visibleOptions {
        kind
        values
      }
    }
    wikiSectionsFilter {
      kind
      values
    }
    summaryFieldsFilter {
      kind
      values
    }
  }
`;
export const WORKFLOW_VIEW_PROVIDER =`
  query WorkflowsViewProviderQuery {
    workflowsView {
      ...WorkflowsViewFragment
    }
  }
  ${WORKFLOW_VIEW_PROVIDER_FRAGMENT}
`;