export declare const loadMockValue: () => {
    type: "LOAD_MOCK_VALUE";
};
export declare const mockValueLoaded: (value: string) => {
    type: "MOCK_VALUE_LOADED";
    payload: string;
};
