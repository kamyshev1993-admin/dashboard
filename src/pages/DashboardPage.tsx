import {useNavigate} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {TASKS_KEY, USER_KEY} from "../constants/localStorageKeys.ts";
import {LOGIN_URL, NEW_TASK_URL} from "../constants/routes.ts";
import {type TaskDto, TaskData, tasksMapping, PendingStatus, CompletedStatus} from "../types.ts";
import {useState} from "react";
import {getTasks} from "../api/task.ts";

const ITEMS_PER_PAGE = 10
const TASKS_QUERY_LIMIT = 10;


export default function DashboardPage() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)

    const useQueryResult = useQuery<TaskDto[]>({
        queryKey: ['tasksData'],
        queryFn: async () => {
            const apiTasks: TaskDto[] = await getTasks(TASKS_QUERY_LIMIT)
            // Пробуем получить все таски для всех пользователей
            const allTasks = localStorage.getItem(TASKS_KEY)
            if (!allTasks) {
                return apiTasks
            }
            const taskMap = new Map<string, TaskData[]>(JSON.parse(allTasks))

            // Получаем текущего пользователя
            const userKey = localStorage.getItem(USER_KEY)
            if (!userKey) {
                return apiTasks
            }
            // Получаем таски текущего пользователя
            const userTasks = taskMap.get(userKey)
            if (!userTasks) {
                return apiTasks
            }
            const mappedUserTasks = tasksMapping(userTasks)
            // Склеиваем api + user таски
            return [...mappedUserTasks, ...apiTasks]
        },
        retry: 3
    })

    const totalPages = Math.ceil(
        (useQueryResult.data?.length ?? 0) / ITEMS_PER_PAGE
    )
    const start = (page - 1) * ITEMS_PER_PAGE
    const visibleTasks = (useQueryResult.data ?? []).slice(
        start,
        start + ITEMS_PER_PAGE
    )

    return (
        <div className="dashboard-page">

            <button
                className="logout-button"
                onClick={() => {
                    localStorage.removeItem(USER_KEY)
                    navigate(LOGIN_URL)
                }}
            >
                Logout
            </button>

            {useQueryResult.isPending && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <span>Loading tasks...</span>
                </div>
            )}

            {useQueryResult.isSuccess && (
                <>
                    <h1 className="dashboard-title">My Tasks</h1>
                    <div className="task-list">
                        {visibleTasks.map((d, index) => (
                            <div key={index} className="tasks">
                                <h2 className="task-name">{d.title}</h2>
                                <span className="task-status">
                                    {d.completed ? CompletedStatus : PendingStatus}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        > ←
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        > →
                        </button>
                    </div>
                    <button
                        onClick={() => navigate(NEW_TASK_URL)}
                    >
                        Add New Task
                    </button>
                </>
            )}

            {useQueryResult.isError && (
                <div className="error">
                    <div className="error-icon">!</div>
                    <h2>Can't load tasks</h2>
                    <p>
                        Something went wrong while loading your tasks.
                        Please try again later.
                    </p>
                </div>
            )}
        </div>
    )
}