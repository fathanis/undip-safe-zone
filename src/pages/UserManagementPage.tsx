
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Search, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the user schema for validation
const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  nim: z.string().min(3, "NIM/Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["mahasiswa", "petugas", "admin"], {
    required_error: "Pilih peran untuk user",
  }),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState(() => {
    // Get mock users from AuthContext source
    return [
      {
        id: '1',
        name: 'Mahasiswa Undip',
        nim: '21120120140100',
        role: 'mahasiswa',
      },
      {
        id: '2',
        name: 'Petugas Keamanan',
        nim: 'petugas',
        role: 'petugas',
      },
      {
        id: '3',
        name: 'Admin Sistem',
        nim: 'admin',
        role: 'admin',
      },
    ];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      nim: "",
      password: "",
      role: "mahasiswa",
    },
  });

  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      nim: "",
      password: "",
      role: "mahasiswa",
    },
  });

  const handleAddUser = (data: UserFormValues) => {
    // In a real app, this would make an API call
    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      nim: data.nim,
      role: data.role,
    };
    
    setUsers((prevUsers) => [...prevUsers, newUser]);
    toast.success("User berhasil ditambahkan");
    setIsAddUserDialogOpen(false);
    form.reset();
  };

  const handleEditUser = (data: UserFormValues) => {
    // In a real app, this would make an API call
    if (!selectedUser) return;
    
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === selectedUser.id
          ? { ...u, name: data.name, nim: data.nim, role: data.role }
          : u
      )
    );
    
    toast.success("User berhasil diperbarui");
    setIsEditUserDialogOpen(false);
  };

  const handleDeleteUser = () => {
    // In a real app, this would make an API call
    if (!selectedUser) return;
    
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== selectedUser.id));
    toast.success("User berhasil dihapus");
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    editForm.setValue("name", user.name);
    editForm.setValue("nim", user.nim);
    editForm.setValue("role", user.role);
    editForm.setValue("password", ""); // Don't show existing password
    setIsEditUserDialogOpen(true);
  };

  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4 space-y-6">
        <Card className="bg-gradient-to-r from-undip-blue to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Manajemen Pengguna</CardTitle>
            <CardDescription className="text-blue-100">
              Kelola pengguna sistem UNDIP Safe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p>Admin: {currentUser?.name}</p>
                <p className="text-sm text-blue-200">Universitas Diponegoro</p>
              </div>
              <div className="space-x-2">
                <Badge className="bg-blue-500">{users.filter(u => u.role === 'mahasiswa').length} Mahasiswa</Badge>
                <Badge className="bg-yellow-500">{users.filter(u => u.role === 'petugas').length} Petugas</Badge>
                <Badge className="bg-red-500">{users.filter(u => u.role === 'admin').length} Admin</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Cari pengguna..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Tambah User
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIM / Username</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                      Tidak ada pengguna yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.nim}</TableCell>
                      <TableCell>
                        {user.role === "mahasiswa" && <Badge className="bg-blue-500">Mahasiswa</Badge>}
                        {user.role === "petugas" && <Badge className="bg-yellow-500">Petugas</Badge>}
                        {user.role === "admin" && <Badge className="bg-red-500">Admin</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mr-1"
                          onClick={() => openEditDialog(user)}
                          disabled={user.nim === currentUser?.nim} // Prevent editing self
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteDialog(user)}
                          disabled={user.nim === currentUser?.nim} // Prevent deleting self
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah User</DialogTitle>
            <DialogDescription>
              Tambahkan pengguna baru ke dalam sistem.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIM / Username</FormLabel>
                    <FormControl>
                      <Input placeholder="NIM atau username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peran</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih peran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                        <SelectItem value="petugas">Petugas</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Tambah User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Ubah informasi pengguna.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="nim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIM / Username</FormLabel>
                    <FormControl>
                      <Input placeholder="NIM atau username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Baru (kosongkan jika tidak ingin mengubah)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password baru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peran</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih peran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                        <SelectItem value="petugas">Petugas</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna {selectedUser?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default UserManagementPage;
