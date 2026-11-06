import { MissingMethod } from "./missing_props.js"

interface TaskProps {
    start: Function,
    stop: Function
}

export function buildTask(task: TaskProps) {
    if (!task.start)
        MissingMethod("Task", "start");
    if (!task.stop)
        MissingMethod("Task", "stop");
    return (task)
}