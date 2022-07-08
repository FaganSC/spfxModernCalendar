declare interface ICalendarWebPartStrings {
  FormSave: string;
  FormCancel: string;
  FormLoading: string;
  FormLoadingDescription: string;
}

declare module 'SPFormStrings' {
  const strings: ICalendarWebPartStrings;
  export = strings;
}