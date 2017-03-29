import _ from 'lodash';

export default function buildGroups(dotted) {
  const groups = []

  _.forEach(_.filter(_.keys(dotted), p=>p.split('.').slice(-1)=='leaf'), (paths) =>{
      let pathArray = paths.split('.')
      groups.push(_.filter(pathArray, p => !p.match(/^(node)$/)).slice(0,-1))
  });

  const labels = _.fromPairs(_.map(_.filter(_.keys(dotted), p=>p.split('.').slice(-1)=='label'), (paths) =>
      [_.filter(paths.split('.'), p => !p.match(/^(node)$/)).slice(0,-1).join('.'), dotted[paths]]
  ))

  applyLabels(groups, labels);
  // strip labels beginning with _
  return groups.map((group) => _.filter(group, item => item[0]!=='_'));
}

function applyLabels(groups, labels) {
  _.forEach(groups, (g) => {
    const toLabel = {}
    for (let ind=0; ind<g.length; ind++) {
        const pathPart = g.slice(0, ind+1).join('.')
        if (labels[pathPart]) toLabel[ind] = labels[pathPart]
    }
    _.forEach(_.keys(toLabel), labelIndex => g[labelIndex] = toLabel[labelIndex])
  });
}
