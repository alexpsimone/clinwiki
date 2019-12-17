import * as React from 'react';
import styled from 'styled-components';
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
    const allowedFields = this.props.workflow
      ? displayFields(
          this.props.workflow.summaryFieldsFilter.kind,
          this.props.workflow.summaryFieldsFilter.values,
          this.props.workflow.allSummaryFields.map(name => ({
            name,
            rank: null,
          })),
        ).map(prop('name'))
      : ["nct_id", "type", "status", "completion_date", "enrollment", "source"];

    return (
      <div className="container">

        <Helmet>
          <title>{`Wiki - ${this.props.study.briefTitle}`}</title>
        </Helmet>

        <CollapsiblePanel header={this.props.study.briefTitle || ''}>
          <Table striped bordered condensed>
            <tbody>
              { allowedFields.map(name =>
                  <tr key={name}>
                    <th>{sentanceCaseFromCamelCase(name)}</th>
                    <td>{this.props.study[name]}</td>
                  </tr>)
              }
            </tbody>
          </Table>
        </CollapsiblePanel>
      </div>
    );
  }
}

export default StudySummary;
