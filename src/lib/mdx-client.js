import countBy from 'lodash/countBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';

export function sortDateFn(contentA, contentB) {
  return (
    new Date(contentB.lastUpdated ?? contentB.publishedAt).valueOf() -
    new Date(contentA.lastUpdated ?? contentA.publishedAt).valueOf()
  );
}

export function sortByDate(contents) {
  return contents.sort(sortDateFn);
}

export function sortTitleFn(contentA, contentB) {
  return contentA.title.localeCompare(contentB.title);
}

export function sortByTitle(contents) {
  return contents.sort((a, b) =>
    a.title > b.title ? 1 : b.title > a.title ? -1 : 0
  );
}

/**
 * Get tags of each post and remove duplicates
 */
export function getTags(contents) {
  const tags = contents.reduce(
    (accTags, content) => [...accTags, ...content.tags.split(',')],
    []
  );

  return map(sortBy(toPairs(countBy(tags)), 1), 0).reverse();
}
