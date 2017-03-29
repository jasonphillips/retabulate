const basic = `PROC TABULATE DATA=main;
  TITLE "GPA by Gender, Instate Status, and Year";
  VAR GPA; 
  CLASS Term Level Gender Instate; 
  TABLE 
      Gender="" * Instate="AL",
      (Term="Year" ALL="Grand Total") * 
      Level="" * GPA="" * (mean="avg"*f=4.2 n="Count");
  FOOTNOTE "not real data";
RUN;`

const deaths = `PROC TABULATE DATA=deaths;
  TITLE "Death Rate by Year, Sex";
  TITLE1 "check the CLASS, VAR statements for other columns";
  FOOTNOTE "Source: catalog.data.gov, New York City Leading Causes of Death";
  
  CLASS Year Sex RaceEthnicity;
  VAR Deaths DeathRate;
  
  TABLE DeathRate='' * (mean*f=6.2 min max),
  	Year * Sex='';
RUN;`

const births = `PROC TABULATE DATA=births;
  TITLE "Births by Year, Race of Mother";
  TITLE1 "check the CLASS, VAR statements for other columns";
  FOOTNOTE "Source: catalog.data.gov,  NCHS - Births, Birth Rates, and Fertility Rates, by Race of Mother";
  
  CLASS Year Race;
  VAR LiveBirths BirthRate FertilityRate;
  
  TABLE Race='' ALL, 
     (LiveBirths BirthRate) * 
     (min*f=COMMA12. mean='avg'*f=COMMA12. max*f=COMMA12.);
RUN;`

export default {basic, deaths, births};