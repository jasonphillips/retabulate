import _ from 'lodash';
import dot from 'dot-object';

export default function buildGroups(nestedObject) {
  const dotted = dot.dot(nestedObject)
  const groups = []
  const leaves = []
  const {labels, transforms} = extractLabels(dotted);

  _.forEach(_.filter(_.keys(dotted), p=>p.split('.').slice(-1)=='leaf'), (paths) =>{
      let pathArray = paths.split('.')
      groups.push(_.filter(pathArray, p => !p.match(/^(node)$/)).slice(0,-1))
      leaves.push(dotted[paths])
  });

  applyTransforms(groups, transforms);

  // strip levels beginning with _skip_
  return {labels, leaves, groups: groups.map((group) => _.filter(group, item => item.slice(0,6)!=='_skip_'))};
}

function extractLabels(dotted) {
  const labels = {};
  const transforms = {};

  _.forEach(_.filter(_.keys(dotted), p=>p.split('.').slice(-1)=='label'), (paths,index) => {
    const renderId = dotted[paths.split('.').slice(0,-1).concat(['renderId']).join('.')];
    
    labels[`_${renderId}|${index}`] = dotted[paths];
    transforms[paths.split('.').slice(0,-1).join('.')] = `_${renderId}|${index}`;
  });

  return {labels, transforms};
}

function applyTransforms(groups, transforms) {
  _.forEach(groups, (g) => {
    const toLabel = {}
    for (let ind=0; ind<g.length; ind++) {
        const pathPart = g.slice(0, ind+1).join('.')
        if (transforms[pathPart]) toLabel[ind] = transforms[pathPart]
    }
    _.forEach(_.keys(toLabel), labelIndex => g[labelIndex] = toLabel[labelIndex])
  });
}
