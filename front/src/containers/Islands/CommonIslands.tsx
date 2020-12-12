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
  expander: makeIsland<unknown,never>(({attributes, children}) => {
    return (
      <CollapsiblePanel
        header={attributes['header'] || 'header'}
        collapsed={attributes['collapsed'] == 'true'}>
        {children}
      </CollapsiblePanel>
    );
  }),
};

export interface NCTID { nctId : string }

export const studyIslands : IslandCollection<NCTID,never> = {
  ...commonIslands,
  workflow: makeIsland(({attributes, context}) => (
    <WorkflowIsland name={attributes['name']} nctId={context?.nctId} />
  )),
  facility: makeIsland(({context}) => (
    <FacilityIsland nctId={context?.nctId} />
  )),
  wikipage: makeIsland(({context}) => (
    <WikiPageIsland nctId={context.nctId} />
  )),
  navigation: makeIsland(({context}) => (
    <NavigationIsland nctId={context.nctId} />
  )),
  editshistory: makeIsland(({context}) => (
    <EditsHistoryIsland nctId={context?.nctId} />
  )),
  back: makeIsland(({context}) => (
    <BackIsland nctId={context?.nctId} />
  )),
  reactions: makeIsland(({context}) => (
    <ReactionsIsland nctId={context?.nctId} />
  )),
  reviews: makeIsland(({context}) => (
    <ReviewsIsland nctId={context?.nctId} />
  )),
};
