type RoutesType = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    handler: string;
    config: any;
    isEnabled: boolean;
    id?: number;
}[];
export declare function useHomePage(): {
    routesList: RoutesType;
    isLoading: boolean;
    handleAssignPolicyToRoute: (path: string, method: string, handler: string, id?: number) => Promise<void>;
};
export {};
