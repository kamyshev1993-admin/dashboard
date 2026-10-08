export type TaskDto = {
    userId: number
    id: number
    title: string
    completed: boolean
}

export const PendingStatus: string = "Pending";
export const CompletedStatus: string = "Completed";

export class TaskData {
    title: string = "";
    description: string = "";
    status: string = PendingStatus;
}

export function tasksMapping(tasks: TaskData[]): TaskDto[] {
    return tasks.map((task) => (
        taskDataToDto(task)
    ))
}

export function taskDataToDto(task: TaskData): TaskDto {
    // В задании ничего не сказано про маппинг. Так как я отображаю только title и completed - мне этого достаточно
    return {
        userId: NaN,
        id: NaN,
        title: task.title,
        completed: task.status === CompletedStatus
    }
}
