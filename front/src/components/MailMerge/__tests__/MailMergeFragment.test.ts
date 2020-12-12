import { gql } from 'apollo-boost';
import { fragmentFromString } from '../MailMergeFragment';

it('fragmentFromString', () => {
  const query : string = `
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
