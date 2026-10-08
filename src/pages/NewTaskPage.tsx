import {useNavigate} from "react-router";
import {useState} from "react";
import {TASK_URL} from "../constants/routes.ts";
import {TASKS_KEY, USER_KEY} from "../constants/localStorageKeys.ts";
import {useMutation} from "@tanstack/react-query";
import {useQueryClient} from "@tanstack/react-query"
import {CompletedStatus, PendingStatus, TaskData, taskDataToDto} from "../types.ts";
import {postTask} from "../api/task.ts";

function validateTitle(title: string): string | null {
    if (title.trim() === "") {
        return "Title is required";
    }
    if (title.trim().length < 5) {
        return "Title must contain at least 5 characters";
    }
    return null;
}

function updateLocalStorage(taskData: TaskData) {
    const userKey = localStorage.getItem(USER_KEY)
    if (!userKey) {
        return
    }
    const allTasks = localStorage.getItem(TASKS_KEY)
    const taskMap = allTasks
        ? new Map<string, TaskData[]>(JSON.parse(allTasks))
        : new Map<string, TaskData[]>()
    const userTasks = taskMap.get(userKey)
    if (userTasks) {
        userTasks.push(taskData)
    } else {
        taskMap.set(userKey, [taskData])
    }
    localStorage.setItem(
        TASKS_KEY,
        JSON.stringify([...taskMap])
    )
}

export default function NewTaskPage() {
    const [taskData, setTaskData] = useState<TaskData>(new TaskData());
    const [titleError, setTitleError] = useState<string | null>(null);
    const [titleTouched, setTitleTouched] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (task: TaskData) => {
            return await postTask(taskDataToDto(task))
        },
        onSuccess: async (_, taskData) => {
            updateLocalStorage(taskData)
            await queryClient.invalidateQueries({
                queryKey: ["tasksData"]
            })
            setTimeout(() => {
                navigate(TASK_URL)
            }, 1500)
        }
    })

    const navigate = useNavigate();

    function handleTitleChange(value: string) {
        setTaskData({...taskData, title: value});
        setTitleError(validateTitle(value));
    }

    const isFormValid = validateTitle(taskData.title) === null;

    return (
        <div className="new-task-page">
            <h1>New Task</h1>

            <label>Title</label>
            <input
                id="title"
                type="text"
                value={taskData.title}
                onChange={(event) => {
                    handleTitleChange(event.target.value)
                }}
                onBlur={(event) => {
                    handleTitleChange(event.target.value)
                    setTitleTouched(true)
                }}
            />

            {titleTouched && titleError && (
                <div role="alert">{titleError}</div>
            )}

            <label>Description</label>
            <input
                id="description"
                type="text"
                value={taskData.description}
                onChange={(event) => {
                    setTaskData({
                        ...taskData,
                        description: event.target.value,
                    })
                }}
            />

            <label>Status</label>
            <select
                id="status"
                value={taskData.status}
                onChange={(event) => {
                    setTaskData({
                        ...taskData,
                        status: event.target.value,
                    })
                }}
            >
                <option value={CompletedStatus}>
                    {CompletedStatus}
                </option>
                <option value={PendingStatus}>
                    {PendingStatus}
                </option>
            </select>

            {mutation.isPending && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <span>Try to add new task...</span>
                </div>
            )}

            {mutation.isSuccess && (
                <div className="success">
                    New Task was successful added!
                </div>
            )}

            {mutation.isError && (
                <div className="error">Ошибка</div>
            )}

            <button
                disabled={!isFormValid}
                onClick={() => mutation.mutate(taskData)}
            >
                Submit
            </button>
            <button onClick={() => {
                navigate(TASK_URL)
            }
            }>Back to dashboard
            </button>
        </div>
    )
}