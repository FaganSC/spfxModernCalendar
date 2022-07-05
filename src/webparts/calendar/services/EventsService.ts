import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PageContext } from "@microsoft/sp-page-context";

import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/regional-settings/web";
import { IList, IListAddResult, IListInfo } from "@pnp/sp/lists";

import * as moment from 'moment';

import { DisplayEvents } from "../models/dataModels";

export class EventService {
    private _sp: SPFI;

    public constructor(webPartContext: WebPartContext) {
        const pageContext: PageContext = webPartContext.pageContext;
        this._sp = spfi().using(SPFx({ pageContext }));
    }

    public getDefaultEventsList = async (): Promise<string> => {
        const listName: string = "Events";
        const lists: IList[] = await this._sp.web.lists.filter(`Title eq '${listName}'`)();
        if (lists.length > 0) {
            const list: IList = this._sp.web.lists.getByTitle(listName);
            const listInfo: IListInfo = await list.select("Id")();
            return listInfo.Id;
        } else {
            const listAddResult: IListAddResult = await this._sp.web.lists.add(listName, "", 106, true, { OnQuickLaunch: true });
            return listAddResult.data.Id;
        }
    }

    public getPrimaryCalendarEvents = async (listId: string, startDate: string, endDate: string): Promise<DisplayEvents[]> => {
        try {
            const results: any = await this._sp.web.lists.getById(listId).items
                .filter(`EventDate ge '${moment(startDate).format("YYYY-MM-DDT00:00:00Z")}' and EventDate le '${moment(endDate).format("YYYY-MM-DDT11:59:59Z")}'`)
                .orderBy("EventDate", true)();
            if (results && results.length > 0) {
                const promises: any = await results.map(async (item: any) => {
                    if (item.fAllDayEvent) {
                        const startDate: string = await this._sp.web.regionalSettings.timeZone.localTimeToUTC(item.EventDate);
                        const endDate: string = await this._sp.web.regionalSettings.timeZone.localTimeToUTC(item.EndDate);
                        const returnEvent: DisplayEvents = {
                            id: item.Id,
                            title: item.Title,
                            startDate: moment(startDate).toDate(),
                            endDate: moment(endDate).toDate(),
                            allDay: item.fAllDayEvent
                        };
                        return returnEvent;
                    } else {
                        const startDate: string = await this._sp.web.regionalSettings.timeZone.utcToLocalTime(item.EventDate);
                        const endDate: string = await this._sp.web.regionalSettings.timeZone.utcToLocalTime(item.EndDate);
                        if (moment(startDate).format("YYYYMMDD") !== moment(endDate).format("YYYYMMDD")) {
                            const returnEvent: DisplayEvents[] = [{
                                id: item.Id,
                                title: item.Title,
                                startDate: moment(startDate).toDate(),
                                endDate: moment(startDate).endOf('day').toDate(),
                                allDay: item.fAllDayEvent
                            }, {
                                id: item.Id,
                                title: item.Title,
                                startDate: moment(endDate).startOf('day').toDate(),
                                endDate: moment(endDate).toDate(),
                                allDay: item.fAllDayEvent
                            }];
                            return returnEvent;
                        } else {
                            const returnEvent: DisplayEvents = {
                                id: item.Id,
                                title: item.Title,
                                startDate: moment(startDate).toDate(),
                                endDate: moment(endDate).toDate(),
                                allDay: item.fAllDayEvent
                            }
                            return returnEvent;
                        }
                    }
                });
                const returnedEvents: DisplayEvents[] = [];
                await Promise.all(promises)
                    .then((docs: any) => {
                        docs.map((doc => {
                            if (Array.isArray(doc)) {
                                doc.map((item => {
                                    returnedEvents.push(item);
                                }));
                            } else {
                                returnedEvents.push(doc);
                            }
                        }));
                    })
                    .catch((error: any) => {

                    });
                // Return Data
                return Promise.resolve(returnedEvents);
            } else {
                return Promise.resolve([]);
            }
        } catch (error) {
            console.dir(error);
            return Promise.reject(error);
        }
    }
}