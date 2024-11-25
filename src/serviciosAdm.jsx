import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/ServiciosAdm.css';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null); // Estado para los datos del servicio en edición
  const [newServiceData, setNewServiceData] = useState({ nombre_servicio: '', descripcion_servicio: '', imagen_servicio: '' }); // Estado para el nuevo formulario de datos
  const [showAddService, setShowAddService] = useState(false); // Estado para mostrar el formulario de agregar servicio

  // Obtener los servicios desde el backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/servicios', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setServicios(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los servicios');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Eliminar un servicio
  const handleDelete = async (id_servicio) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        await axios.delete(`http://localhost:3000/admin/servicios/${id_servicio}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setServicios(servicios.filter(service => service.id_servicio !== id_servicio));
        alert('Servicio eliminado correctamente');
      } catch (error) {
        alert('Error al eliminar el servicio');
      }
    }
  };

  // Iniciar la edición de un servicio
  const handleEdit = (servicio) => {
    setEditingService(servicio);
    setNewServiceData({
      nombre_servicio: servicio.nombre_servicio,
      descripcion_servicio: servicio.descripcion_servicio,
      imagen_servicio: servicio.imagen_servicio
    });
  };

  // Guardar los cambios de un servicio
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/servicios/${editingService.id_servicio}`,
        newServiceData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Actualizar el estado con los nuevos datos del servicio
      setServicios(servicios.map(service => service.id_servicio === editingService.id_servicio ? response.data : service));
      setEditingService(null); // Cerrar el formulario de edición
      alert('Servicio actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar el servicio');
    }
  };

  // Agregar un nuevo servicio
  const handleAddService = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/admin/servicios',
        newServiceData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setServicios([...servicios, response.data]);
      setNewServiceData({ nombre_servicio: '', descripcion_servicio: '', imagen_servicio: '' }); // Limpiar el formulario
      setShowAddService(false); // Cerrar el formulario de agregar servicio
      alert('Servicio agregado correctamente');
    } catch (error) {
      alert('Error al agregar el servicio');
    }
  };

  const handleCancel = () => {
    setEditingService(null); // Cerrar el formulario de edición
    setShowAddService(false); // Cerrar el formulario de agregar servicio
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <br />
      <br />
      <br />
      <h1>Servicios</h1>
      
      {/* Formulario para agregar un servicio */}
      {(editingService || showAddService) && (
        <div>
          <h2 className='nuevo-serv'>{editingService ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h2>
          <form>
            <div>
              <label>Nombre del Servicio</label>
              <input
                type="text"
                value={newServiceData.nombre_servicio}
                onChange={(e) => setNewServiceData({ ...newServiceData, nombre_servicio: e.target.value })}
              />
            </div>
            <div>
              <label>Descripción</label>
              <input
                type="text"
                value={newServiceData.descripcion_servicio}
                onChange={(e) => setNewServiceData({ ...newServiceData, descripcion_servicio: e.target.value })}
              />
            </div>
            <div>
              <label>Imagen del Servicio</label>
              <input
                type="text"
                value={newServiceData.imagen_servicio}
                onChange={(e) => setNewServiceData({ ...newServiceData, imagen_servicio: e.target.value })}
              />
            </div>
            <button className='boton-guardar' onClick={editingService ? handleSave : handleAddService}> 
              {editingService ? 'Guardar Cambios' : 'Agregar Servicio'}
            </button>
            <button className='boton-cancelar' onClick={handleCancel}>Cancelar</button>
          </form>
        </div>
      )}


      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio) => (
            <tr key={servicio.id_servicio}>
              <td>{servicio.nombre_servicio}</td>
              <td>{servicio.descripcion_servicio}</td>
              <td><img src={servicio.imagen_servicio} alt={servicio.nombre_servicio} style={{ width: '50px', height: '50px' }} /></td>
              <td>
                <button className='boton-editar' onClick={() => handleEdit(servicio)}>Editar</button>
                <button className='boton-eliminar' onClick={() => handleDelete(servicio.id_servicio)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='boton-agregar' onClick={() => setShowAddService(true)}>Agregar Servicio</button>
    </div>
  );
};

export default Servicios;