"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
  const tasks = useQuery(api.calendar.list);
  const createTask = useMutation(api.calendar.create);
  const deleteTask = useMutation(api.calendar.remove);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDate = (day: number) => {
    const date = new Date(year, month, day);
    const startOfDay = date.setHours(0, 0, 0, 0);
    const endOfDay = date.setHours(23, 59, 59, 999);
    
    return tasks?.filter((t) => {
      const taskDate = new Date(t.scheduledAt).getTime();
      return taskDate >= startOfDay && taskDate <= endOfDay;
    }) || [];
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !selectedDate) return;
    
    await createTask({
      title: newTaskTitle.trim(),
      scheduledAt: selectedDate.getTime(),
      completed: false,
    });
    
    setNewTaskTitle("");
    setSelectedDate(null);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask({ id: id as any });
  };

  if (tasks === undefined) {
    return <Layout><div className="flex items-center justify-center min-h-[400px]">Loading calendar...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold italic">Calendar</h1>
            <p className="text-muted-foreground">Scheduled tasks and cron jobs 📅</p>
          </div>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl">{monthName} {year}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dayTasks = getTasksForDate(day);
                const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`aspect-square p-2 text-left border rounded-lg hover:bg-muted transition-colors relative ${
                      isToday ? "border-primary bg-primary/5" : "border-border/30"
                    }`}
                  >
                    <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                        {dayTasks.slice(0, 3).map((t, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${
                              t.completed ? "bg-green-500" : "bg-primary"
                            }`}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-[8px] leading-none">+{dayTasks.length - 3}</div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="New task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              />
              <Button size="icon" onClick={handleAddTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {selectedDate && getTasksForDate(selectedDate.getDate()).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks scheduled</p>
              )}
              
              {selectedDate && getTasksForDate(selectedDate.getDate()).map((task) => (
                <div key={task._id} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <div className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
