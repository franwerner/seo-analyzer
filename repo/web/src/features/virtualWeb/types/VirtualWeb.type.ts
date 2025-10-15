export interface VirtualWeb {
    id: number;
    host: string;
    virtualWebConfig: {
        virtualDom: {
            id: number;
            pathname: string;
        }
    }
    virtualDomCount: number;
}