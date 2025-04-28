import { createContext, useContext, useEffect, useState } from "react";
import { Employee, Position, Task } from "../types";
import useDataProvider from "../dataProvider";

type FormContextType = {
    employees: Employee[];
    positions: Position[];
    tasks: Task[];
    updateEmployees: () => Promise<void>;
    updatePositions: () => Promise<void>;
    updateTasks: () => Promise<void>;
};

const FormContext = createContext<FormContextType>({
    employees: [],
    positions: [],
    tasks: [],
    updateEmployees: async () => { },
    updatePositions: async () => { },
    updateTasks: async () => { },
});

const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};

const FormProvider = ({ children }: { children: React.ReactNode }) => {
    const { getList } = useDataProvider();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const updateEmployees = async () => {
        const { data } = await getList('employees');
        setEmployees(data);
    };

    const updatePositions = async () => {
        const { data } = await getList('positions');
        setPositions(data);
    }

    const updateTasks = async () => {
        const { data } = await getList('tasks');
        setTasks(data);
    }

    useEffect(() => {
        updateEmployees();
        updatePositions();
        updateTasks();
    }, []);

    return (
        <FormContext.Provider value={{ employees, positions, tasks, updateEmployees, updatePositions, updateTasks }}>
            {children}
        </FormContext.Provider>
    )
}

export { useFormContext, FormProvider };
