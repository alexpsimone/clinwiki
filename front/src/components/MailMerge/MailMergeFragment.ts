import { gql } from 'apollo-boost';
import { DocumentNode } from 'graphql';
import { useMemo, useState } from 'react';
import { Island, IslandCollection } from './MailMergeIslands';

export type FragmentName = string;
export type Fragment = { queryType: string; fragment: DocumentNode };
export type FragmentCollection = Record<FragmentName, Fragment>;

function mustacheTokens(input: string) {
  let tokens: string[] = [];
  const yeet = (t: string) => {
    if (t !== '') tokens.push(t);
  };
  let current = '';
  let last = '';
  let inside = false;
  for (const ch of input) {
    if (ch === '{' && last !== '{') {
      // Begin {{
      inside = true;
      current = ch;
    } else if (last === '{' && ch !== '{') {
      // Begin inside token
      current = ch;
    } else if (ch === '}' && last !== '}' && inside) {
      inside = false;
      // Begin }}
      yeet(current);
      current = ch;
    } else {
      current += ch;
    }
    last = ch;
  }
  return tokens;
}

type Marker = 'x';
function tokensToGraphQLOb(tags: string[]) {
  let result: Record<string, object | Marker> = {};
  let scope = result;
  let stack = [result];
  const pushScope = name => {
    const parts = name.split('.');
    stack.push(scope);
    for (const s of parts) {
      let temp = scope[s] || {};
      if (temp === 'x') temp = {};
      scope[s] = temp;
      scope = temp as any;
    }
  };
  const popScope = () => {
    scope = stack.pop() || result;
  };
  const setProperty = (name: string) => {
    const index = name.lastIndexOf('.');
    if (index > 0) {
      // multi part property
      const scopeName = name.slice(0, index);
      const propName = name.slice(index + 1);
      pushScope(scopeName);
      scope[propName] = 'x';
      popScope();
    } else {
      // single value
      scope[name] = 'x';
    }
  };
  for (const t of tags) {
    // Check for 'block helper'
    if (t.startsWith('#')) {
      // split on any whitespace, remove blanks
      const parts = t.split(/\s/).filter(id => id);
      if (parts.length > 1) {
        const name = parts[1];
        pushScope(name);
      }
    } else if (t.startsWith('/')) {
      popScope();
    }
    // Check for non-block helper. Very similar to block helper but doesn't create a scope
    else if (t.indexOf(' ') > 0) {
      const parts = t.split(/\s/).filter(id => id);
      if (parts.length > 1) {
        const name = parts[parts.length - 1];
        //Hardcoded for now, to be kept in list like commonIslands
        //Will handle cases of handlers who should  not be part of the fragment
        if (
          parts[0] == 'querystring' ||
          parts[0] == '$LEFT' ||
          parts[0] == '$RIGHT' ||
          parts[0] == '$TRUNCATE'
        ) {
          console.log('');
        } else {
          setProperty(name);
        }
      }
    } else {
      setProperty(t);
    }
  }
  return result;
}

function jsonToFragmentBody(
  json: Record<string, object | Marker>,
  indent = ''
) {
  if (Object.keys(json).length == 0) return '';
  var result = '{\n';
  for (const key in json) {
    const value = json[key];
    result += indent;
    if (value === 'x') {
      result += key;
      result += '\n';
    } else {
      result += key;
      result += jsonToFragmentBody(
        value as Record<string, object | Marker>,
        indent + '  '
      );
    }
  }
  result += '}\n';
  return result;
}

export function fragmentFromString(fragment: string): FragmentCollection {
  const regexp = /fragment ([^ ]*) on ([^ ]*)/g;
  const matches = [...fragment.matchAll(regexp)];
  const [_, fragmentName, queryType] = matches[0];
  return {
    [fragmentName]: {
      queryType,
      fragment: gql(fragment),
    },
  };
}

export function fragmentFromGql(fragment: DocumentNode): FragmentCollection {
  const results: FragmentCollection = {};
  for (const def of fragment.definitions) {
    if (def.kind == 'FragmentDefinition') {
      const name = def.name;
      const queryType = def.typeCondition.name;
      results[name.value] = {
        queryType: queryType.value,
        fragment: fragment,
      };
    }
  }
  return results;
}

export function getUsedIslands(
  template: string,
  islands: IslandCollection
): IslandCollection {
  const re = /<([A-Z][a-z]*)/g;
  const matches = [...template.matchAll(re)];
  const result: IslandCollection = {};
  for (const m of matches) {
    const [_, islandName] = m;
    if (islandName in islands) {
      result[islandName] = islands[islandName];
    }
  }
  return result;
}

function toFragment(
  name: string,
  className: string,
  body: string
): FragmentCollection {
  if (body) {
    const fragment = gql`fragment ${name} on ${className} { ${body} }`;
    return {
      [name]: {
        queryType: className,
        fragment: fragment,
      },
    };
  } else {
    return {};
  }
}

// Exported for test
export function fragmentsFromMMTemplate(
  fragmentName: string,
  className: string,
  template: string,
  islands: IslandCollection
): FragmentCollection {
  const tokens = mustacheTokens(template);
  const json = tokensToGraphQLOb(tokens);
  const fragmentBody = jsonToFragmentBody(json);
  const usedIslands = getUsedIslands(template, islands);
  var res = toFragment(fragmentName, className, fragmentBody);
  for (const key in usedIslands) {
    const i = usedIslands[key];
    if (i.fragments) {
      for (const key in i.fragments) {
        if (!(key in res)) {
          res[key] = i.fragments[key];
        }
      }
    }
  }
  return res;
}

function randomIdentifier() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
  return Array.from({ length: 12 }, randomChar).join('');
}

export function useFragment(
  className: string,
  template: string,
  islands: IslandCollection
): Record<string, Fragment> {
  const [fragmentName, _] = useState<string>(randomIdentifier());
  return useMemo(() => {
    return fragmentsFromMMTemplate(fragmentName, className, template, islands);
  }, [fragmentName, className, template, islands]);
}
