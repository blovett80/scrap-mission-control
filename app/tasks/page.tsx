"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, User, Bot, X, Check, GripVertical } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const statusColumns = [
  { id: "backlog", label: "Backlog", color: "text-muted-foreground" },
  { id: "todo", label: "To Do", color: "text-foreground" },
  { id: "in_progress", label: "In Progress", color: "text-blue-600" },
  { id: "done", label: "Done", color: "text-green-600" },
] as const;

type TaskStatus = typeof statusColumns[number]["id"];

interface Task {
  _id: Id<"tasks">;
  title: string;
  status: TaskStatus;
  assignee: "me" | "assistant";
}

function TaskCard({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="group relative hover:shadow-md transition-all border-border/50 hover:border-primary/20 cursor-grab active:cursor-grabbing"
    >
      <CardContent className="p-4 pt-5">
        <div className="flex items-start gap-2">
          <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground/40 hover:text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm leading-snug">{task.title}</h3>
            <div className="mt-3 flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 border border-border/30 w-fit">
              {task.assignee === "me" ? (
                <User className="h-3 w-3 text-primary" />
              ) : (
                <Bot className="h-3 w-3 text-blue-500" />
              )}
              <span className="text-[10px] uppercase font-bold tracking-tighter">
                {task.assignee}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3 text-destructive/70 hover:text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TasksPage() {
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState<"me" | "assistant">("me");
  const [activeId, setActiveId] = useState<Id<"tasks"> | null>(null);

  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const deleteTask = useMutation(api.tasks.remove);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !addingTo) return;

    await createTask({
      title: newTaskTitle.trim(),
      status: addingTo,
      assignee: newTaskAssignee,
    });

    setNewTaskTitle("");
    setAddingTo(null);
    setNewTaskAssignee("me");
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as Id<"tasks">);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !tasks) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    if (!activeTask) return;

    // Check if we're over a column (droppable)
    const overColumn = statusColumns.find((col) => col.id === over.id);
    if (overColumn && activeTask.status !== overColumn.id) {
      updateStatus({
        id: activeTask._id,
        status: overColumn.id as TaskStatus,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  if (tasks === undefined) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          Loading tasks...
        </div>
      </Layout>
    );
  }

  const activeTask = tasks.find((t) => t._id === activeId);

  return (
    <Layout>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold italic">Tasks</h1>
              <p className="text-muted-foreground">
                Track what we&apos;re working on 🍺
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {statusColumns.map((column) => {
              const columnTasks = tasks.filter((t) => t.status === column.id);
              return (
                <div
                  key={column.id}
                  className="space-y-4 bg-muted/20 p-3 rounded-xl border border-border/50 min-h-[200px]"
                >
                  <div className="flex items-center justify-between px-2">
                    <h2
                      className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        column.color
                      )}
                    >
                      {column.label}
                      <span className="ml-2 text-[10px] opacity-50 bg-muted px-1.5 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-muted"
                      onClick={() =>
                        setAddingTo(addingTo === column.id ? null : column.id)
                      }
                    >
                      <Plus
                        className={cn(
                          "h-4 w-4 transition-transform",
                          addingTo === column.id && "rotate-45"
                        )}
                      />
                    </Button>
                  </div>

                  <SortableContext
                    items={columnTasks.map((t) => t._id)}
                    strategy={verticalListSortingStrategy}
                    id={column.id}
                  >
                    <div className="space-y-3">
                      {addingTo === column.id && (
                        <Card className="border-primary/50 shadow-sm overflow-hidden">
                          <CardContent className="p-3 space-y-3">
                            <Input
                              autoFocus
                              placeholder="What needs doing?"
                              className="text-sm h-8 border-none focus-visible:ring-0 px-1"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddTask();
                                if (e.key === "Escape") setAddingTo(null);
                              }}
                            />
                            <div className="flex items-center gap-2 px-1">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                Assign to:
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  variant={
                                    newTaskAssignee === "me" ? "default" : "ghost"
                                  }
                                  size="sm"
                                  className="h-6 px-2 text-[10px]"
                                  onClick={() => setNewTaskAssignee("me")}
                                >
                                  <User className="h-3 w-3 mr-1" />
                                  Me
                                </Button>
                                <Button
                                  variant={
                                    newTaskAssignee === "assistant"
                                      ? "default"
                                      : "ghost"
                                  }
                                  size="sm"
                                  className="h-6 px-2 text-[10px]"
                                  onClick={() => setNewTaskAssignee("assistant")}
                                >
                                  <Bot className="h-3 w-3 mr-1" />
                                  Assistant
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setAddingTo(null)}
                              >
                                <X className="h-3 w-3 mr-1" /> Cancel
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={handleAddTask}
                              >
                                <Check className="h-3 w-3 mr-1" /> Add
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onDelete={() => deleteTask({ id: task._id })}
                        />
                      ))}

                      {columnTasks.length === 0 && !addingTo && (
                        <div className="border rounded-lg border-dashed p-10 text-center bg-muted/10 opacity-40">
                          <p className="text-[10px] uppercase tracking-widest font-black">
                            Empty
                          </p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <Card className="border-primary shadow-lg rotate-3">
              <CardContent className="p-4">
                <h3 className="font-medium text-sm">{activeTask.title}</h3>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Layout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
