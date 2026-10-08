import type {TaskDto} from "../types.ts";
import {TASKS_URL} from "./endpoint.ts";


export async function getTasks(limit: number): Promise<TaskDto[]> {
    const url = new URL(TASKS_URL)
    url.searchParams.append("_limit", limit.toString())

    const request = new Request(url)
    const response = await fetch(request)
    return await response.json()
}

export async function postTask(task: TaskDto): Promise<TaskDto> {
    const request = new Request(TASKS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    })
    const response = await fetch(request)
    if (!response.ok) {
        throw new Error("Failed to create task")
    }
    return await response.json()
}