import _ from 'lodash';

const filterWithIndices = (arr, condition) => {
    const matching = []
    const indices = []
    arr.forEach((item,i) => {
        if (condition(item)) {
            matching.push(item)
            indices.push(i)
        }
    })
    return {matching, indices}
}

export default function buildRows({groups, leaves}, pivoted) {
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
          const {matching, indices} = filterWithIndices(groups, g => pathTo(g,i)===parentPath)
          const uniqValues = _.uniq(_.map(matching, group => group[i]))

          // for each unique item, create a cell
          _.forEach(uniqValues, value => {
              // gather the leaf descendents, to later target cells
              const descendents = filterWithIndices(groups, 
                group => pathTo(group,i)===parentPath && group[i]===value
              )
              const span = descendents.indices.length

              cells.push(
                {
                    path: parentPath,
                    label: value,
                    [spanKey]: span,
                    leaves: descendents.indices.map(l => leaves[l])
                }
              )

              if (pivoted) _.range(1, span).forEach(i => cells.push(null))
          })
      })

      rows.push(cells)
  }

  return rows;
}
