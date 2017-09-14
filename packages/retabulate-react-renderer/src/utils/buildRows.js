import _ from 'lodash';

export default function buildRows(groups, pivoted) {
  const maxDepth = _.max(groups.map(g => g.length))
  const pathTo = (group, depth) => group.slice(0,depth).join('.')
  const rows = []
  const spanKey = pivoted ? 'rowSpan' : 'colSpan';

  // for each level
  for (let i=0; i<maxDepth; i++) {
      const cells = []

      // gather each unique parent path
      const parentPaths = _.uniq(_.map(groups, group => pathTo(group,i)))

      // for each parent path, gather unique items
      _.map(parentPaths, parentPath => {
          const matchingGroups = _.filter(groups, g => pathTo(g,i)===parentPath)
          const uniqValues = _.uniq(_.map(matchingGroups, group => group[i]))

          // for each unique item, create a cell
          _.forEach(uniqValues, value => {
              const span = _.filter(matchingGroups, group => group[i]===value).length

              cells.push(
                {
                    path: parentPath,
                    label: value,
                    [spanKey]: span,
                }
              )

              if (pivoted) _.range(1, span).forEach(i => cells.push(null))
          })
      });      

      rows.push(cells)
  }

  return rows;
}
