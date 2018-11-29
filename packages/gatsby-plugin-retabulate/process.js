const print = require('graphql/language/printer').print
const { Tabulation } = require("retabulate-react/lib/graphqlFragments")


// need to bootstrap babel processing, since we'll be
// compiling react code for the tabulations
require('@babel/register')({ 
  // these presets should be available from gatsby itself
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

function processTabulations (path, contents) {
  delete require.cache[require.resolve(path)]
  let tablesComponent = require(path);

  if (tablesComponent.default) {
    if (typeof(tablesComponent.default)==='object') {
      tablesComponent = { ...tablesComponent, ...tablesComponent.default }
    }
  }

  const tableNames = [];
  let fragments = '';

  // all retabulations must be top-level named exports
  Object.keys(tablesComponent).forEach(tableName => {
    const comp = tablesComponent[tableName];

    if (
      typeof(comp)!=='object' ||
      comp.type !== Tabulation
    ) return;

    tableNames.push(tableName);

    const staticFragment = print(comp.type.getFragment(Object.assign(
      {}, 
      comp.props, 
      {
        name: `${tableName}StaticData`,
        config: {
          rootType: 'tabulations'
        }
      }
    )))

    const userFragment = print(comp.type.getFragment(Object.assign(
      {}, 
      comp.props, 
      {
        name: `${tableName}FragmentData`,
        config: {
          rootType: 'tabulations'
        }
      }
    )))

    // the StaticQuery option is only possible for one table per file
    if (!fragments.length) {
      fragments += `\n
      \nexport const ${tableName}Static = props => 
        <StaticQuery query={graphql\`
          query {
            retabulateRoot {
              tabulations {
                ...${tableName}StaticDataFragment
              }
            }
          }
          ${staticFragment}
        \`}
          render={ 
            data => 
              <${tableName}.type {...${tableName}.props} 
                data={ data.retabulateRoot.tabulations['${tableName}StaticData'] }
              /> 
            }
      />
      \n`
    }

     fragments += `\n
     \nexport const ${tableName}Component = props => 
        <${tableName}.type 
          {...${tableName}.props} 
          {...props}
          data={ props.data.retabulateRoot.tabulations['${tableName}FragmentData'] }
        />

     \nexport const ${tableName}Fragment = graphql\`
        fragment ${tableName}Fragment on Query {
          retabulateRoot {
            tabulations {
              ...${tableName}FragmentDataFragment
            }
          }
        }
        ${userFragment}
     \`
    \n`
  })

  if (fragments) return `\nimport {StaticQuery, graphql} from 'gatsby';\n${contents}\n${fragments}`;
  return contents;
}

module.exports = processTabulations