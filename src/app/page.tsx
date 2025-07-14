"use client"

import { useState } from "react"
// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Plus, Search } from "lucide-react"
import { axiosAuthInstance } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

// Types
interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string,
}

const getTasks = async () => {
  return await axiosAuthInstance().get("http://localhost:2211/task")
}


// Static data
const tasks: Task[] = [
  {
    id: 1,
    name: "Thiết kế giao diện trang chủ",
    description: "Tạo mockup và thiết kế UI/UX cho trang chủ website",
    // status: "in-progress",
    // priority: "high",
    dueDate: "2024-01-15",
    // assignee: "Nguyễn Văn A",
  },
]

// Config
// const statusConfig = {
//   todo: { label: "Chưa làm", className: "bg-gray-100 text-gray-800" },
//   "in-progress": { label: "Đang làm", className: "bg-blue-100 text-blue-800" },
//   completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
// }

// const priorityConfig = {
//   low: { label: "Thấp", className: "bg-green-100 text-green-800" },
//   medium: { label: "Trung bình", className: "bg-yellow-100 text-yellow-800" },
//   high: { label: "Cao", className: "bg-red-100 text-red-800" },
// }

export default function TaskDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: getTasks,
  });

  console.log(data?.data.data)

  // Filter tasks based on search
  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      // task.assignee.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate stats
  // const stats = {
  //   total: tasks.length,
  //   todo: tasks.filter((t) => t.status === "todo").length,
  //   inProgress: tasks.filter((t) => t.status === "in-progress").length,
  //   completed: tasks.filter((t) => t.status === "completed").length,
  // }

  // const statsData = [
  //   {
  //     title: "Tổng số task",
  //     value: stats.total,
  //     icon: ListTodo,
  //     color: "text-blue-600",
  //     bgColor: "bg-blue-100",
  //   },
  //   {
  //     title: "Chưa làm",
  //     value: stats.todo,
  //     icon: Clock,
  //     color: "text-gray-600",
  //     bgColor: "bg-gray-100",
  //   },
  //   {
  //     title: "Đang làm",
  //     value: stats.inProgress,
  //     icon: AlertCircle,
  //     color: "text-orange-600",
  //     bgColor: "bg-orange-100",
  //   },
  //   {
  //     title: "Hoàn thành",
  //     value: stats.completed,
  //     icon: CheckCircle,
  //     color: "text-green-600",
  //     bgColor: "bg-green-100",
  //   },
  // ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Task</h1>
              <p className="text-gray-600 mt-1">Quản lý công việc hiệu quả</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm Task
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg leading-tight">{task.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              </CardHeader>
              <CardContent>
                {/* <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={statusConfig[task.status].className}>{statusConfig[task.status].label}</Badge>
                  <Badge className={priorityConfig[task.priority].className}>
                    {priorityConfig[task.priority].label}
                  </Badge>
                </div> */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(task.dueDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{task.assignee}</span>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Không tìm thấy task nào</div>
            <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
          </div>
        )}
      </main>
    </div>
  )
}
