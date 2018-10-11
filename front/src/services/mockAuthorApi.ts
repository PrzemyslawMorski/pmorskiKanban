import { delayInMillis } from "./delay";

const mockValue = "Kanban pmorski - mock";

export class MockValueApi {
    public static getValue(): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockValue);
            }, delayInMillis);
        });
    }
}
