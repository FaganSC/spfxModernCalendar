import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PageContext } from "@microsoft/sp-page-context";

import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings/web";

export class SPSiteService {
    private _sp: SPFI;
    public constructor(webPartContext: WebPartContext) {
        const pageContext: PageContext = webPartContext.pageContext;
        this._sp = spfi().using(SPFx({ pageContext }));
    }

    public convertToUTCTime = async (value: any): Promise<string> => {
        const utcTime: any = await this._sp.web.regionalSettings.timeZone.localTimeToUTC(value);
        return utcTime;
    }

    public convertToLocalTime = async (value: any): Promise<string> => {
        const localTIme: any = await this._sp.web.regionalSettings.timeZone.utcToLocalTime(value);
        return localTIme;
    }
}