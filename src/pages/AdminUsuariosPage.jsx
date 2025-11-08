import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { getAllUsers, updateUserRole, ROLES } from "../lib/userService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Actualizar la lista local
      setUsers(users.map(user => 
        user.id === userId ? { ...user, rol: newRole } : user
      ));
    } catch (error) {
      console.error("Error al actualizar rol:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administración de Usuarios</h1>
      
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol Actual</TableHead>
              <TableHead>Acciones</TableHead>
              <TableHead>Última Actualización</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nombre || "Sin nombre"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell>
                  {user.id !== currentUser.uid && (
                    <Select
                      value={user.rol}
                      onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLES).map(([key, value]) => (
                          <SelectItem key={value} value={value}>
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  {user.updatedAt?.toDate().toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}