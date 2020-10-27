import React from 'react';
import WorkflowIsland from './WorkflowIsland';
import FacilityIsland from './FacilityIsland';
import WikiPageIsland from './WikiPageIsland';
import BackIsland from './BackIsland';
import NavigationIsland from './NavigationIsland';
import ReactionsIsland from './ReactionsIsland';
import ReviewsIsland from './ReviewsIsland';
import EditsHistoryIsland from './EditsHistoryIsland';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { IslandCollection, makeIsland } from 'components/MailMerge/MailMergeIslands';

/*
  Common island configuration for MailMerge pages
*/

export const commonIslands = {
  expander: makeIsland((attributes: Record<string, string>, context, children) => {
    return (
      <CollapsiblePanel
        header={attributes['header'] || 'header'}
        collapsed={attributes['collapsed'] == 'true'}>
        {children}
      </CollapsiblePanel>
    );
  }),
};

export const studyIslands: IslandCollection = {
  ...commonIslands,
  workflow: makeIsland((attributes: Record<string, string>, context?: any) => (
    <WorkflowIsland name={attributes['name']} nctId={context?.nctId} />
  )),
  facility: makeIsland((attributes: Record<string, string>, context?: any) => (
    <FacilityIsland nctId={context?.nctId} />
  )),
  wikipage: makeIsland((attributes: Record<string, string>, context?: any) => (
    <WikiPageIsland nctId={context?.nctId} />
  )),
  navigation: makeIsland((attributes: Record<string, string>, context?: any) => (
    <NavigationIsland nctId={context?.nctId} />
  )),
  editshistory: makeIsland((attributes: Record<string, string>, context?: any) => (
    <EditsHistoryIsland nctId={context?.nctId} />
  )),
  back: makeIsland((attributes: Record<string, string>, context?: any) => (
    <BackIsland nctId={context?.nctId} />
  )),
  reactions: makeIsland((attributes: Record<string, string>, context?: any) => (
    <ReactionsIsland nctId={context?.nctId} />
  )),
  reviews: makeIsland((attributes: Record<string, string>, context?: any) => (
    <ReviewsIsland nctId={context?.nctId} />
  )),
};
