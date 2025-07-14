"use client"

import { useEffect, useState } from "react"
// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {  Calendar, Edit, MoreHorizontal, Plus, Search, Trash2, User, CheckCircle, Clock, AlertCircle, ListTodo, } from "lucide-react"
import { axiosAuthInstance } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"; // ✅ đây là Badge UI bạn cần
import {  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
 } from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "react-toastify"

const getTasks = async () => {
  return await axiosAuthInstance().get("http://localhost:2211/task")
}

export interface User {
  firstName: string,
  lastName: string
}

export interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string; // ISO date string, ví dụ: "2025-07-14T00:00:00.000Z"
  status: 'todo' | 'in-progress' | 'completed'; // key dùng để map với statusConfig
  priority: 'low' | 'medium' | 'high';           // key dùng để map với priorityConfig
  deadLine: string;
  user: User,

}
// Config
const statusConfig = {
  todo: { label: "Chưa làm", className: "bg-gray-100 text-gray-800" },
  "in-progress": { label: "Đang làm", className: "bg-blue-100 text-blue-800" },
  completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
}

const priorityConfig = {
  low: { label: "Thấp", className: "bg-green-100 text-green-800" },
  medium: { label: "Trung bình", className: "bg-yellow-100 text-yellow-800" },
  high: { label: "Cao", className: "bg-red-100 text-red-800" },
}

const getNextStatus = (currentStatus: Task["status"]): Task["status"] => {
  switch (currentStatus) {
    case "todo":
      return "in-progress"
    case "in-progress":
      return "completed"
    default:
      return "todo"
  }
}

export default function TaskDashboard() {
  const [taskData, setTaskData] = useState<Task[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "todo" as Task["status"],
    priority: "medium" as Task["priority"],
    deadLine: "",
    assignee: "",
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)


  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: getTasks,
  });

  useEffect(() => {
    if (data?.data?.data) {
      setTaskData(data.data.data); // Gán dữ liệu task vào state
    }
  }, [data]);


    // Quick status change
  const handleStatusChange = (id: number, newStatus: Task["status"]) => {
    setTaskData(taskData.map((task: Task) => (task.id === Number(id)? { ...task, status: newStatus } : task)))
  }

  // Filter tasks based on search
  const filteredTasks = taskData.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      // task.assignee.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate stats
  const stats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter((t) => t.status === "todo").length,
    inProgress: filteredTasks.filter((t) => t.status === "in-progress").length,
    completed: filteredTasks.filter((t) => t.status === "completed").length,
  }

  const statsData = [
    {
      name: "Tổng số task",
      value: stats.total,
      icon: ListTodo,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Chưa làm",
      value: stats.todo,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      name: "Đang làm",
      value: stats.inProgress,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      name: "Hoàn thành",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const router = useRouter()

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      setIsLoggedIn(parsed.isLoggedIn)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push('/auth/login') // Chuyển hướng nếu chưa đăng nhập
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null // Hoặc return loading spinner


  const getStatusButtonText = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "Bắt đầu"
      case "in-progress":
        return "Hoàn thành"
      case "completed":
        return "Làm lại"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTask) {
      // Update existing task
      const res = await axiosAuthInstance().put(`http://localhost:2211/task/${editingTask.id}`, formData);
      toast.success(res.data.message)  
    } else {
      // console.log(formData)
      const res = await axiosAuthInstance().post("http://localhost:2211/task", formData)
      toast.success(res.data.message)  
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "todo",
      priority: "medium",
      deadLine: "",
      assignee: "",
    })
    setEditingTask(null)
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setFormData({
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      deadLine: task.deadLine,
      assignee: "",
    })
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    const res = await axiosAuthInstance().put(`http://localhost:2211/task/delete/${id}`);
    toast.success(res.data.message)  

  }
  


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
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm Task
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" onClick={() => openEditDialog(task)} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(task)}>
                        <Edit className="h-4 w-4 mr-2" onClick={() => openEditDialog(task)} />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem  onClick={() => handleDelete(task.id)}  className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={statusConfig[task.status].className}>
                    {statusConfig[task.status].label}</Badge>
                  <Badge className={priorityConfig[task.priority].className}>
                    {priorityConfig[task.priority].label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(task.deadLine).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{task.user.firstName + task.user.lastName}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(task.id, getNextStatus(task.status))}
                  className="w-full"
                >
                  {getStatusButtonText(task.status)}
                </Button>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Chỉnh sửa Task" : "Thêm Task Mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề *</Label>
              <Input
                id="title"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tiêu đề task..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả chi tiết..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Task["status"]) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Chưa làm</SelectItem>
                    <SelectItem value="in-progress">Đang làm</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Độ ưu tiên</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Task["priority"]) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Hạn hoàn thành *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.deadLine}
                  onChange={(e) => setFormData({ ...formData, deadLine: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Người thực hiện *</Label>
                <Input
                  id="assignee"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  placeholder="Tên người thực hiện"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
              >
                Hủy
              </Button>
              <Button type="submit">{editingTask ? "Cập nhật" : "Thêm mới"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
