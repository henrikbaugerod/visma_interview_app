import { useState } from 'react';
import './App.css'
import useDataProvider from './dataProvider'
import { Employee, Position, Task } from './types';
import { FormProvider, useFormContext } from './providers/FormProvider';
import { format } from 'date-fns';

function App() {
    return (
        <FormProvider>
            <Content />
        </FormProvider>
    )
}

const Content = () => {
    const { employees, positions, tasks } = useFormContext();

    return (
        <div className="container">
            <div className="row my-3">
                <div className="col">
                    <h1>Visma Who Does What</h1>
                </div>
            </div>

            <div className="row my-4">
                <div className="col-lg-6 d-flex flex-column gap-5">
                    <div className="bg-light rounded-2 p-4">
                        {/* Add new Employee */}
                        <NewEmployeeForm />
                    </div>

                    <div className="bg-light rounded-2 p-4">
                        {/* Add new position */}
                        <NewPositionForm />
                    </div>

                    <div className="bg-light rounded-2 p-4">
                        <NewTaskForm />
                    </div>
                </div>

                <div className="col-lg-6 d-flex flex-column gap-5">
                    <div className="bg-light rounded-2 p-4">
                        <h4>Search</h4>
                        <SearchForm />
                    </div>

                    <div className="bg-light rounded-2 p-4">
                        <h4>Employee List</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees?.map((employee: Employee) => (
                                    <tr key={employee.id}>
                                        <td>{employee.id}</td>
                                        <td>{employee.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-light rounded-2 p-4">
                        <h4>Positions List</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>EmployeeId</th>
                                    <th>FromDate</th>
                                    <th>ToDate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {positions?.map((position: Position) => (
                                    <tr key={position.id}>
                                        <td>{position.id}</td>
                                        <td>{position.name}</td>
                                        <td>{position.employeeId}</td>
                                        <td>{format(position.fromDate, "dd.MM.yyyy")}</td>
                                        <td>{format(position.toDate, "dd.MM.yyyy")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-light rounded-2 p-4">
                        <h4>Task List</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>EmployeeId</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks?.map((task: Task) => (
                                    <tr key={task.id}>
                                        <td>{task.id}</td>
                                        <td>{task.name}</td>
                                        <td>{task.employeeId}</td>
                                        <td>{format(task.date, "dd.MM.yyyy")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SearchForm = () => {
    const { getOne } = useDataProvider();
    const [id, setId] = useState<number | null>(null);
    const [type, setType] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (id === null || type === '') return;
        const { data } = await getOne(type, { id });
        console.log("Search: ", data);
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col-7">
                        <input
                            type="number"
                            className="form-control"
                            id="id"
                            value={id ?? ''}
                            onChange={(e) => setId(e.target.value ? Number(e.target.value) : null)}
                            placeholder="Enter ID"
                            required
                        />
                    </div>

                    <div className="col-5">
                        <select
                            className="form-select"
                            id="employeeId"
                            required
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="" disabled selected>Select Type</option>
                            <option value="employees">Employee</option>
                            <option value="positions">Position</option>
                            <option value="tasks">Task</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>
        </>
    )
}

const NewEmployeeForm = () => {
    const { create } = useDataProvider();
    const { updateEmployees } = useFormContext();
    const [name, setName] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await create('employees', { name });
        await updateEmployees();
        setName('');
    }

    return (
        <>
            <h4>Add new Employee</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        required
                        minLength={2}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Employee</button>
            </form>
        </>
    )
}

const NewPositionForm = () => {
    const { create } = useDataProvider();
    const { employees, updatePositions } = useFormContext();
    const [name, setName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await create('positions', { name, employeeId, fromDate, toDate })
            .then((res) => {
                console.log("Response: ", res)
            });
        await updatePositions();
        setName('');
        setEmployeeId('');
        setFromDate('');
        setToDate('');
    }

    return (
        <>
            <h4>Add new Position</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        required
                        minLength={2}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="employeeId" className="form-label">Employee</label>
                    <select
                        className="form-select"
                        id="employeeId"
                        required
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    >
                        <option value="">Select Employee</option>
                        {employees.map((employee: Employee) => (
                            <option key={employee.id} value={employee.id}>{employee.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        required
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Add Position</button>
            </form>
        </>
    )
}

const NewTaskForm = () => {
    const { create } = useDataProvider();
    const { employees, updateTasks } = useFormContext();
    const [name, setName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await create('tasks', { name, employeeId, date })
            .then((res) => {
                console.log("Response: ", res)
            });
        await updateTasks();
        setName('');
        setEmployeeId('');
        setDate('');
    }

    return (
        <>
            <h4>Add new Task</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        required
                        minLength={2}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="employeeId" className="form-label">Employee</label>
                    <select
                        className="form-select"
                        id="employeeId"
                        required
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    >
                        <option value="">Select Employee</option>
                        {employees.map((employee: Employee) => (
                            <option key={employee.id} value={employee.id}>{employee.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Add Task</button>
            </form>
        </>
    )
}

export default App