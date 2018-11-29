const print = require('graphql/language/printer').print
const path = require('path')
const { tableField } = require('retabulate-graphql/lib/schema/graphqlSchema');
const processTabulations = require('./process')

const { 
    graphql, 
    GraphQLObjectType,
} = require('graphql');

const AllName = (string) => string.charAt(0).toUpperCase() + string.replace(/_/g,'').slice(1);

/*
  Create retabulateRoot node, upon which further schema will be added below
*/
exports.sourceNodes = ({ actions }) => {
    const { createNode } = actions
    
    createNode({
        id: 'retabulate-root',
        parent: `___SOURCE___`,
        children: [],
        internal: {
            contentDigest: 'retabulate-root-id',
            type: `RetabulateRoot`,
        }
    });

    return;
  }
  
/*
  attach retabulate schema to the node created above
*/
exports.setFieldsOnGraphQLNodeType = (
    { type, store, pathPrefix, getNode, cache },
    pluginOptions
  ) => {
    if (type.name!=='RetabulateRoot') return; 

    const tabulations = new GraphQLObjectType({
      name: 'tabulations',
      fields: {
          table: tableField,
      },
    });

    const newFields = {
      tabulations: {
        type: tabulations,
        resolve: (parent, {id}, context) => {

          // set up a getDataset method for retabulate to fetch gatsby datasets
          context.getDataset = (name) => new Promise((resolve, reject) => {
            // read non-internal fields
            const schema = store.getState().schema;
            const fields = Object.keys(schema._typeMap[name]._fields).filter(
              k => ['parent','children','internal'].indexOf(k)===-1
            );
  
            // execute
            graphql(schema, `
              query retabulateFetchData {
                all${AllName(name)} {
                  edges {
                    node {
                      id
                      ${fields}
                    }
                  }
                }
              }
            `).then(result => resolve(
              result.data[`all${AllName(name)}`].edges.map(e => e.node)
            ));
          });

          return {};
        },
      }
    }

    return Promise.resolve(newFields);
}

const singleTabulate = /\.tab.js$/

/*
  build & add appropriate fragment exports to any .tabulation.js page 
*/
exports.preprocessSource = (data, pluginOptions) => {
  const { filename, contents } = data
  if (!filename.match(singleTabulate)) return null;
  return processTabulations(filename, contents)
}

exports.resolvableExtensions = () => [`.tab.js`]


exports.onCreateWebpackConfig = ({ actions, loaders }) => {
  const jsLoader = loaders.js()

  if (!jsLoader) {
    return
  }

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.tab.js$/,
          use: [
            jsLoader,
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-react', '@babel/preset-env'],
                plugins: [
                  `babel-plugin-remove-graphql-queries`,
                ]
              }
            },
            { loader: path.resolve(__dirname, 'retabulate-loader.js') },
          ]
        },
      ],
    },
  })
}

