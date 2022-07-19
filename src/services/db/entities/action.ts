export interface Action {
    group: string,
    id: number,
    starter?: string,
    executed?: boolean,
    cancelled?: boolean,
}