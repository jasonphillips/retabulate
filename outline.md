## Outline

### History of the Problem at UA

 - our wide uses of the tabulate procedure
 - the need for shipping data across frameworks
 - proc tabulate gives us a "realized" table with all nestings computed
   - but how do we communicate and store the logic of pivots that leads to each table cell?
   
 ### Other Languages
 
 - we use a variety of languages as glue across our projects (Python, some R, node.js, etc)
 - the unique nature of `proc tabulate` is that its concise definition of nesting logic is not available in any other framework
 
 ### Parsing Proc Tabulate
 
 - the nested logic of table statement (concatenation versus `*` operator) can be parsed readily by any tokenizing system
 - in our case, we use `peg.js` to render a simple syntax tree that duplicates the nesting in a returned object
 - understanding how to bulid and traverse this tree makes the basic principles of `proc tabulate` readily apparent: 
   - indices of `class` variables are built into a nested map of your data rows, by axis
   - concatentation allows more than one route at the same level
   - a cell in the table represents the union of the sets produced by the left and top axes intersecting at that point
   - set operations are executed against a single value selected from that unioned set
 
 ### Reusing and Querying the Results
 
 - by connecting the procedure's output to the object describing the tabulation statement used, we can query specific subsets by named paths and return the value calculated by SAS
 - in the interest of showing the value of work across paradigms, I will also demonstrate our method of recalculating basic statistics in nested groups using the output tree and Facebook's GraphQL syntax
 

