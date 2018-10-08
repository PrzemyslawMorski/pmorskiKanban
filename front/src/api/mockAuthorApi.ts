import {from, Observable} from "rxjs";
import {delayInMillis} from "./delay";

const mockValue = "Kanban pmorski - mock";

export class MockValueApi {
    public static getValue(): Observable<string> {
        return from(new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockValue);
            }, delayInMillis);
        }));
    }
}
