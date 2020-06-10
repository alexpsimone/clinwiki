import * as React from 'react';
import { Table } from 'react-bootstrap';
import { gql } from 'apollo-boost';
import { StudySummaryFragment } from 'types/StudySummaryFragment';
import { Helmet } from 'react-helmet';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import { prop } from 'ramda';
import { sentanceCaseFromCamelCase } from 'utils/helpers';

interface StudySummaryProps {
  study: StudySummaryFragment;
  workflow: WorkflowConfigFragment | null;
  workflowsView: WorkflowsViewFragment;
}

class StudySummary extends React.PureComponent<StudySummaryProps> {
  static fragment = gql`
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
      design
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
      reactionsCount{
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
      targetDuration
      type
      updatedAt
      verificationDate
      verificationMonthYear
      whyStopped
    }
  `;

  render() {
    const allowedFields: string[] = this.props.workflow
      ? displayFields(
          this.props.workflow.summaryFieldsFilter.kind,
          this.props.workflow.summaryFieldsFilter.values,
          this.props.workflow.allSummaryFields.map(name => ({
            name,
            rank: null,
          }))
        ).map(prop('name'))
      : [
          'nctId',
          'type',
          'overallStatus',
          'completionDate',
          'enrollment',
          'source',
        ];

    return (
      <div className="container">
        <Helmet>
          <title>{`Wiki - ${this.props.study.briefTitle}`}</title>
        </Helmet>

        <CollapsiblePanel header={this.props.study.briefTitle || ''}>
          <Table striped bordered condensed>
            <tbody>
              {allowedFields.map(name =>
                name === 'nctId' ? (
                  // Special case nctID to include a link
                  <tr key={name}>
                    <th style={{ minWidth: '100px'}}>NCT ID</th>
                    <td>
                      <a
                        href={`https://clinicaltrials.gov/ct2/show/${this.props.study.nctId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        {this.props.study.nctId}
                      </a>
                    </td>
                  </tr>
                ) : (
                  <tr key={name}>
                    <th>{sentanceCaseFromCamelCase(name)}</th>
                    <td>{this.props.study[name]}</td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </CollapsiblePanel>
      </div>
    );
  }
}

export default StudySummary;
