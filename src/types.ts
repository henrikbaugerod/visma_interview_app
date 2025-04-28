export type Employee = {
    id: number;
    name: string;
}

export type Position = {
    id: number;
    name: string;
    employeeId: number;
    fromDate: string;
    toDate: string;
}

export type Task = {
    id: number;
    name: string;
    employeeId: number;
    date: string;
}