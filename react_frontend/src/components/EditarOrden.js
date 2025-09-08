import React, { useState, useEffect } from 'react';
import './EditarOrden.css';
import Catalogo from './Catalogo';

const EditarOrden = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
  const [itemsOrden, setItemsOrden] = useState([]);
  const [total, setTotal] = useState(0);

  // Datos ficticios de órdenes existentes
  useEffect(() => {
    const ordenesEjemplo = [
      {
        id: 1,
        numeroOrden: 'ORD-001',
        cliente: 'María González',
        mesa: 5,
        estatus: 'pendiente',
        fechaCreacion: new Date('2024-01-15T10:30:00'),
        items: [
          { 
            id: 1, 
            nombre: 'Tacos de Carnitas', 
            precio: 45.00, 
            cantidad: 2, 
            tipo: 'platillo',
            notas: 'Sin cebolla'
          },
          { 
            id: 7, 
            nombre: 'Agua de Horchata', 
            precio: 18.00, 
            cantidad: 1, 
            tipo: 'producto',
            notas: ''
          }
        ],
        total: 108.00,
        notas: 'Para llevar'
      },
      {
        id: 2,
        numeroOrden: 'ORD-002',
        cliente: 'Juan Pérez',
        mesa: 3,
        estatus: 'en_preparacion',
        fechaCreacion: new Date('2024-01-15T11:15:00'),
        items: [
          { 
            id: 2, 
            nombre: 'Enchiladas Rojas', 
            precio: 55.00, 
            cantidad: 1, 
            tipo: 'platillo',
            notas: 'Extra picante'
          },
          { 
            id: 9, 
            nombre: 'Café de Olla', 
            precio: 20.00, 
            cantidad: 2, 
            tipo: 'producto',
            notas: 'Muy caliente'
          },
          { 
            id: 11, 
            nombre: 'Flan Napolitano', 
            precio: 28.00, 
            cantidad: 1, 
            tipo: 'producto',
            notas: ''
          }
        ],
        total: 123.00,
        notas: 'Mesa 3, junto a la ventana'
      },
      {
        id: 3,
        numeroOrden: 'ORD-003',
        cliente: 'Ana Rodríguez',
        mesa: 7,
        estatus: 'pendiente',
        fechaCreacion: new Date('2024-01-15T12:00:00'),
        items: [
          { 
            id: 3, 
            nombre: 'Pozole Rojo', 
            precio: 65.00, 
            cantidad: 1, 
            tipo: 'platillo',
            notas: 'Con todas las guarniciones'
          },
          { 
            id: 8, 
            nombre: 'Agua de Jamaica', 
            precio: 15.00, 
            cantidad: 2, 
            tipo: 'producto',
            notas: 'Poco dulce'
          }
        ],
        total: 95.00,
        notas: ''
      },
      {
        id: 4,
        numeroOrden: 'ORD-004',
        cliente: 'Carlos López',
        mesa: 2,
        estatus: 'completada',
        fechaCreacion: new Date('2024-01-15T09:45:00'),
        items: [
          { 
            id: 6, 
            nombre: 'Ensalada César', 
            precio: 42.00, 
            cantidad: 1, 
            tipo: 'platillo',
            notas: 'Aderezo aparte'
          },
          { 
            id: 10, 
            nombre: 'Jugo de Naranja Natural', 
            precio: 22.00, 
            cantidad: 1, 
            tipo: 'producto',
            notas: ''
          }
        ],
        total: 64.00,
        notas: 'Cliente frecuente'
      },
      {
        id: 5,
        numeroOrden: 'ORD-005',
        cliente: 'Luis Martínez',
        mesa: 1,
        estatus: 'pendiente',
        fechaCreacion: new Date('2024-01-15T13:30:00'),
        items: [
          { 
            id: 4, 
            nombre: 'Quesadillas de Flor de Calabaza', 
            precio: 40.00, 
            cantidad: 3, 
            tipo: 'platillo',
            notas: 'Bien doraditas'
          },
          { 
            id: 14, 
            nombre: 'Elote Desgranado', 
            precio: 25.00, 
            cantidad: 2, 
            tipo: 'producto',
            notas: 'Extra queso'
          },
          { 
            id: 12, 
            nombre: 'Gelatina de Mosaico', 
            precio: 25.00, 
            cantidad: 1, 
            tipo: 'producto',
            notas: ''
          }
        ],
        total: 195.00,
        notas: 'Orden para compartir'
      }
    ];

    setOrdenes(ordenesEjemplo);
  }, []);

  // Calcular total cuando cambian los items
  useEffect(() => {
    const nuevoTotal = itemsOrden.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    setTotal(nuevoTotal);
  }, [itemsOrden]);

  const seleccionarOrden = (orden) => {
    setOrdenSeleccionada(orden);
    setItemsOrden([...orden.items]);
    setMostrarCatalogo(false);
  };

  const agregarItemDesdeCatalogo = (item) => {
    const itemExistente = itemsOrden.find(i => i.id === item.id);
    
    if (itemExistente) {
      setItemsOrden(prevItems =>
        prevItems.map(i =>
          i.id === item.id 
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
    } else {
      const nuevoItem = {
        ...item,
        cantidad: 1,
        notas: ''
      };
      setItemsOrden(prevItems => [...prevItems, nuevoItem]);
    }
  };

  const actualizarCantidad = (itemId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(itemId);
      return;
    }

    setItemsOrden(prevItems =>
      prevItems.map(item =>
        item.id === itemId 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const eliminarItem = (itemId) => {
    setItemsOrden(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const actualizarNotas = (itemId, notas) => {
    setItemsOrden(prevItems =>
      prevItems.map(item =>
        item.id === itemId 
          ? { ...item, notas }
          : item
      )
    );
  };

  const guardarCambios = () => {
    if (!ordenSeleccionada) return;

    const ordenActualizada = {
      ...ordenSeleccionada,
      items: itemsOrden,
      total: total,
      estatus: 'surtir_orden',
      fechaModificacion: new Date()
    };

    setOrdenes(prevOrdenes =>
      prevOrdenes.map(orden =>
        orden.id === ordenSeleccionada.id ? ordenActualizada : orden
      )
    );

    setOrdenSeleccionada(ordenActualizada);
    alert('Orden actualizada correctamente. Estatus cambiado a "Surtir Orden"');
  };

  const cancelarEdicion = () => {
    if (ordenSeleccionada) {
      setItemsOrden([...ordenSeleccionada.items]);
    }
    setMostrarCatalogo(false);
  };

  const obtenerEstatusColor = (estatus) => {
    const colores = {
      'pendiente': '#f39c12',
      'en_preparacion': '#3498db',
      'surtir_orden': '#9b59b6',
      'completada': '#27ae60',
      'cancelada': '#e74c3c'
    };
    return colores[estatus] || '#95a5a6';
  };

  const obtenerEstatusTexto = (estatus) => {
    const textos = {
      'pendiente': 'Pendiente',
      'en_preparacion': 'En Preparación',
      'surtir_orden': 'Surtir Orden',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return textos[estatus] || estatus;
  };

  return (
    <div className="editar-orden-container">
      <div className="editar-orden-header">
        <h1>Gestión de Órdenes</h1>
        <p>Selecciona una orden para editarla y agregar nuevos items</p>
      </div>

      <div className="ordenes-layout">
        {/* Lista de órdenes */}
        <div className="ordenes-lista">
          <h2>Órdenes Existentes</h2>
          <div className="ordenes-grid">
            {ordenes.map(orden => (
              <div 
                key={orden.id} 
                className={`orden-card ${ordenSeleccionada?.id === orden.id ? 'seleccionada' : ''}`}
                onClick={() => seleccionarOrden(orden)}
              >
                <div className="orden-header">
                  <span className="numero-orden">{orden.numeroOrden}</span>
                  <span 
                    className="estatus-badge"
                    style={{ backgroundColor: obtenerEstatusColor(orden.estatus) }}
                  >
                    {obtenerEstatusTexto(orden.estatus)}
                  </span>
                </div>
                
                <div className="orden-info">
                  <p><strong>Cliente:</strong> {orden.cliente}</p>
                  <p><strong>Mesa:</strong> {orden.mesa}</p>
                  <p><strong>Items:</strong> {orden.items.length}</p>
                  <p><strong>Total:</strong> ${orden.total.toFixed(2)}</p>
                  <p><strong>Creada:</strong> {orden.fechaCreacion.toLocaleTimeString()}</p>
                </div>
                
                {orden.notas && (
                  <div className="orden-notas">
                    <small><strong>Notas:</strong> {orden.notas}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor de orden */}
        {ordenSeleccionada && (
          <div className="orden-editor">
            <div className="editor-header">
              <h2>Editando: {ordenSeleccionada.numeroOrden}</h2>
              <div className="editor-controles">
                <button 
                  className="btn-catalogo"
                  onClick={() => setMostrarCatalogo(!mostrarCatalogo)}
                >
                  {mostrarCatalogo ? 'Ocultar Catálogo' : 'Mostrar Catálogo'}
                </button>
                <button className="btn-guardar" onClick={guardarCambios}>
                  Guardar Cambios
                </button>
                <button className="btn-cancelar" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              </div>
            </div>

            <div className="orden-detalles">
              <div className="detalle-item">
                <strong>Cliente:</strong> {ordenSeleccionada.cliente}
              </div>
              <div className="detalle-item">
                <strong>Mesa:</strong> {ordenSeleccionada.mesa}
              </div>
              <div className="detalle-item">
                <strong>Estatus:</strong> 
                <span 
                  className="estatus-actual"
                  style={{ color: obtenerEstatusColor(ordenSeleccionada.estatus) }}
                >
                  {obtenerEstatusTexto(ordenSeleccionada.estatus)}
                </span>
              </div>
            </div>

            {/* Items de la orden */}
            <div className="items-orden">
              <h3>Items en la Orden</h3>
              {itemsOrden.length === 0 ? (
                <div className="sin-items">
                  <p>No hay items en esta orden. Usa el catálogo para agregar algunos.</p>
                </div>
              ) : (
                <div className="items-lista">
                  {itemsOrden.map(item => (
                    <div key={item.id} className="item-orden">
                      <div className="item-info">
                        <div className="item-nombre">
                          {item.nombre}
                          <span className="item-tipo-badge">
                            {item.tipo === 'platillo' ? '🍽️' : '🥤'}
                          </span>
                        </div>
                        <div className="item-precio">${item.precio.toFixed(2)}</div>
                      </div>
                      
                      <div className="item-controles">
                        <div className="cantidad-control">
                          <button 
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            className="btn-cantidad"
                          >
                            -
                          </button>
                          <span className="cantidad">{item.cantidad}</span>
                          <button 
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                            className="btn-cantidad"
                          >
                            +
                          </button>
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Notas especiales..."
                          value={item.notas}
                          onChange={(e) => actualizarNotas(item.id, e.target.value)}
                          className="notas-input"
                        />
                        
                        <button 
                          onClick={() => eliminarItem(item.id)}
                          className="btn-eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div className="item-subtotal">
                        Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="orden-total">
                <h3>Total: ${total.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Catálogo */}
      {mostrarCatalogo && (
        <div className="catalogo-overlay">
          <div className="catalogo-modal">
            <div className="catalogo-modal-header">
              <h3>Agregar Items desde el Catálogo</h3>
              <button 
                className="btn-cerrar-catalogo"
                onClick={() => setMostrarCatalogo(false)}
              >
                ✕
              </button>
            </div>
            <Catalogo 
              onAgregarItem={agregarItemDesdeCatalogo} 
              ordenActiva={!!ordenSeleccionada}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarOrden;