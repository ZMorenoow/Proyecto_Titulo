import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './CSS/TrabajadoresAdm.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // Estado para los datos del usuario en edición
  const [newUserData, setNewUserData] = useState({ nombre: '', apellido: '', correo: '' }); // Estado para el nuevo formulario de datos
  const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

  // Obtener los usuarios desde el backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/getTrabajadores', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsuarios(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los usuarios');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Eliminar un usuario
  const handleDelete = async (id_usuario) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:3000/admin/EliminarUsuario/${id_usuario}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        setUsuarios(usuarios.filter(user => user.id_usuario !== id_usuario));
        alert('Usuario eliminado correctamente');
      } catch (error) {
        alert('Error al eliminar el usuario');
      }
    }
  };

  // Cambiar el rol de un usuario
  const handleRoleChange = async (id_usuario, newRoleId) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/CambiarRol/${id_usuario}`,
        { newRoleId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      alert('Rol actualizado correctamente');
      
      // Solicitar la lista actualizada de usuarios desde el backend
      const response = await axios.get('http://localhost:3000/admin/getTrabajadores', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUsuarios(response.data);
    } catch (error) {
      alert('Error al cambiar el rol');
    }
  };

  // Iniciar la edición de un usuario
  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setNewUserData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo
    });
  };

  // Guardar los cambios de un usuario
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/ActualizarUsuario/${editingUser.id_usuario}`,
        newUserData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Actualizar el estado con los nuevos datos del usuario
      setUsuarios(usuarios.map(user => user.id_usuario === editingUser.id_usuario ? response.data : user));
      setEditingUser(null); // Cerrar el formulario de edición
      alert('Usuario actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar el usuario');
    }
  };

  const handleCancel = () => {
    setEditingUser(null); // Cerrar el formulario de edición
  };

  // Función para redirigir a la página de asignación de reservas
  const handleAsignarTareas = (id_usuario) => {
    navigate(`/reservas-trabajador`);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='trabajadores-adm'>
      <br />
      <br />
      <br />
      <h1>Trabajadores</h1>
       
      {editingUser && (
        <div>
          <h2>Editar Usuario</h2>
          <form>
            <div>
              <label>Nombre</label>
              <input
                type="text"
                value={newUserData.nombre}
                onChange={(e) => setNewUserData({ ...newUserData, nombre: e.target.value })}
              />
            </div>
            <div>
              <label>Apellido</label>
              <input
                type="text"
                value={newUserData.apellido}
                onChange={(e) => setNewUserData({ ...newUserData, apellido: e.target.value })}
              />
            </div>
            <div>
              <label>Correo</label>
              <input
                type="email"
                value={newUserData.correo}
                onChange={(e) => setNewUserData({ ...newUserData, correo: e.target.value })}
              />
            </div>
            <button className='boton-guardar' onClick={handleSave}>Guardar</button>
            <button className='boton-cancelar' onClick={handleCancel}>Cancelar</button>
          </form>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.correo}</td>
              <td>
                <select
                  value={usuario.rol}
                  onChange={(e) => handleRoleChange(usuario.id_usuario, e.target.value)}
                >
                  <option value="3">Trabajador</option>
                  <option value="2">Usuario</option>
                  <option value="1" disabled>Administrador</option>
                </select>
              </td>
              <td>
                <button className='boton-editar'onClick={() => handleEdit(usuario)}>Editar</button>
                <button className='boton-eliminar'onClick={() => handleDelete(usuario.id_usuario)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='boton-asignar'onClick={() => handleAsignarTareas()}>Asignar tareas</button>
    </div>
  );
};

export default Usuarios;