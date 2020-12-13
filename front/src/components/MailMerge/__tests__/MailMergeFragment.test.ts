import React from 'react';
import { identify } from '@fullstory/browser';
import { gql } from 'apollo-boost';
import {
  fragmentFromGql,
  FragmentCollection,
  fragmentFromString,
  getUsedIslands,
  fragmentsFromMMTemplate,
} from '../MailMergeFragment';
import { IslandCollection, makeIsland } from '../MailMergeIslands';

it('fragmentFromString', () => {
  const query: string = `
      fragment UserNameFragment on User {
        firstName
        lastName
      }
  `;
  const expectedResult = {
    UserNameFragment: {
      queryType: 'User',
      fragment: gql(query),
    },
  };

  const testResult = fragmentFromString(query);
  expect(testResult).toEqual(expectedResult);
});

it('fragmentFromGql', () => {
  const query = gql`
    fragment UserNameFragment on User {
      firstName
      lastName
    }
  `;
  const expectedResult = {
    UserNameFragment: {
      queryType: 'User',
      fragment: query,
    },
  };

  const testResult = fragmentFromGql(query);
  expect(testResult).toEqual(expectedResult);
});

it('getUsedIslands', () => {
  const islands: IslandCollection = {
    Apple: makeIsland(() => null as any),
    Banana: makeIsland(() => null as any),
    Pear: makeIsland(() => null as any),
  };
  const expectedResults = { Banana: islands['Banana'] };
  const template = `
    <h1>this is {{title}}:{{nctId}}</h1>
    <div>
      {{shortDescription}}
      <Banana ripe=true></Banana>
    </div>
    <Wagon>carry this</Banana>
  `;
  const usedIslands = getUsedIslands(template, islands);
  expect(usedIslands).toEqual(expectedResults);
});

it('fragmentsFromMMTemplate1', () => {
  const dummyObj: any = this;
  const usernameFragment = fragmentFromString(`
    fragment UserNameFragment on User {
      firstName
      lastName
    }`);

  const otherFragment = fragmentFromString(`
    fragment UnusedFragment on Hobit {
      hairy
      toes
    }`);
  const islands: IslandCollection = {
    Apple: makeIsland(() => dummyObj, otherFragment),
    Banana: makeIsland(() => dummyObj, usernameFragment),
    Pear: makeIsland(() => dummyObj, otherFragment),
    Pineapple: makeIsland(() => dummyObj),
    Whoami: makeIsland(() => dummyObj, usernameFragment),
  };

  const template = `
    <h1>this is {{title}}:{{nctId}}</h1>
    <div>
      {{shortDescription}}
      <Banana ripe=true></Banana>
      <Pineapple>Not on pizza</Pineapple>
    </div>
    <Expander header='logged in as'><Whoami></Expander> `;

  const fragment = fragmentsFromMMTemplate(
    'AnonymousFragment',
    'Study',
    template,
    islands
  );
  

  // The fragment generate from the template and 
  // the usernameFragment should be included but only once
  // The otherFragment should *not* be included
  const expectedResult = {
    ...usernameFragment,
    AnonymousFragment: {
      queryType: 'Study',
      fragment: gql`
        fragment AnonymousFragment on Study {
          title
          nctId
          shortDescription
        }
      `,
    },
  };

  expect(fragment).toEqual(expectedResult);
});

// it('compileQueryFromFragments', () => {
//
//    TODO: need to think about how to compose queries with arguments
//
//   const userQuery = gql`
//     fragment UserNameFragment on User {
//       firstName
//       lastName
//     }
//   `;
//   const nctIdQuery = gql`
//     fragment NctIdQuery on Study {
//     }
//   `;
//   var collection = {
//     ...fragmentFromGql(userQuery),
//     ...fragmentFromGql(nctIdQuery),
//   };
// });
