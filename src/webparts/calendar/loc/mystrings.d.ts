declare interface ICalendarWebPartStrings {
  AppLocalEnvironmentSharePoint : string;
  AppLocalEnvironmentTeams : string;
  AppSharePointEnvironment : string;
  AppTeamsTabEnvironment : string;
  
  PropertyPaneDescription : string;
  BasicGroupName : string;
  PrimaryCalendarList: string;
  DefaultViewFieldLabel : string;
  
  lblToday : string;
  lblPrevious : string;
  lblNext : string;
  lblMonth : string;
  lblWeek : string;
  lblDay : string;
  lblShowMore : string;
  lblWorkWeek : string;
  lblNew: string;
  lblNewCalendarEvent: string;
  lblShare: string;
}

declare module 'CalendarWebPartStrings' {
  const strings: ICalendarWebPartStrings;
  export = strings;
}