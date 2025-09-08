import React, { useState, useEffect } from 'react';
import './Catalogo.css';

const Catalogo = ({ onAgregarItem, ordenActiva }) => {
  const [items, setItems] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Datos ficticios del catálogo
  useEffect(() => {
    const itemsCatalogo = [
      // Platillos principales
      {
        id: 1,
        nombre: 'Tacos de Carnitas',
        tipo: 'platillo',
        categoria: 'principales',
        precio: 45.00,
        descripcion: 'Deliciosos tacos de carnitas con cebolla, cilantro y salsa verde',
        disponible: true,
        imagen: '/images/tacos-carnitas.jpg',
        ingredientes: ['Carne de cerdo', 'Tortillas', 'Cebolla', 'Cilantro', 'Salsa verde']
      },
      {
        id: 2,
        nombre: 'Enchiladas Rojas',
        tipo: 'platillo',
        categoria: 'principales',
        precio: 55.00,
        descripcion: 'Enchiladas bañadas en salsa roja con queso fresco y crema',
        disponible: true,
        imagen: '/images/enchiladas-rojas.jpg',
        ingredientes: ['Tortillas', 'Pollo', 'Salsa roja', 'Queso', 'Crema', 'Cebolla']
      },
      {
        id: 3,
        nombre: 'Pozole Rojo',
        tipo: 'platillo',
        categoria: 'principales',
        precio: 65.00,
        descripcion: 'Tradicional pozole rojo con carne de cerdo y guarniciones',
        disponible: true,
        imagen: '/images/pozole-rojo.jpg',
        ingredientes: ['Maíz pozolero', 'Carne de cerdo', 'Chile guajillo', 'Lechuga', 'Rábanos', 'Orégano']
      },
      {
        id: 4,
        nombre: 'Quesadillas de Flor de Calabaza',
        tipo: 'platillo',
        categoria: 'principales',
        precio: 40.00,
        descripcion: 'Quesadillas con flor de calabaza y queso oaxaca',
        disponible: true,
        imagen: '/images/quesadillas-flor.jpg',
        ingredientes: ['Tortillas', 'Flor de calabaza', 'Queso oaxaca', 'Epazote']
      },
      {
        id: 5,
        nombre: 'Sopa de Tortilla',
        tipo: 'platillo',
        categoria: 'sopas',
        precio: 35.00,
        descripcion: 'Sopa de tortilla con aguacate, queso y chile pasilla',
        disponible: true,
        imagen: '/images/sopa-tortilla.jpg',
        ingredientes: ['Caldo de pollo', 'Tortillas fritas', 'Aguacate', 'Queso', 'Chile pasilla', 'Crema']
      },
      {
        id: 6,
        nombre: 'Ensalada César',
        tipo: 'platillo',
        categoria: 'ensaladas',
        precio: 42.00,
        descripcion: 'Ensalada césar clásica con pollo a la parrilla',
        disponible: true,
        imagen: '/images/ensalada-cesar.jpg',
        ingredientes: ['Lechuga romana', 'Pollo', 'Queso parmesano', 'Crutones', 'Aderezo césar']
      },

      // Bebidas
      {
        id: 7,
        nombre: 'Agua de Horchata',
        tipo: 'producto',
        categoria: 'bebidas',
        precio: 18.00,
        descripcion: 'Refrescante agua de horchata tradicional',
        disponible: true,
        imagen: '/images/agua-horchata.jpg',
        ingredientes: ['Arroz', 'Canela', 'Azúcar', 'Leche condensada']
      },
      {
        id: 8,
        nombre: 'Agua de Jamaica',
        tipo: 'producto',
        categoria: 'bebidas',
        precio: 15.00,
        descripcion: 'Agua fresca de jamaica endulzada',
        disponible: true,
        imagen: '/images/agua-jamaica.jpg',
        ingredientes: ['Flor de jamaica', 'Azúcar', 'Agua']
      },
      {
        id: 9,
        nombre: 'Café de Olla',
        tipo: 'producto',
        categoria: 'bebidas',
        precio: 20.00,
        descripcion: 'Café tradicional con canela y piloncillo',
        disponible: true,
        imagen: '/images/cafe-olla.jpg',
        ingredientes: ['Café', 'Canela', 'Piloncillo']
      },
      {
        id: 10,
        nombre: 'Jugo de Naranja Natural',
        tipo: 'producto',
        categoria: 'bebidas',
        precio: 22.00,
        descripcion: 'Jugo de naranja recién exprimido',
        disponible: true,
        imagen: '/images/jugo-naranja.jpg',
        ingredientes: ['Naranjas frescas']
      },

      // Postres
      {
        id: 11,
        nombre: 'Flan Napolitano',
        tipo: 'producto',
        categoria: 'postres',
        precio: 28.00,
        descripcion: 'Cremoso flan napolitano con caramelo',
        disponible: true,
        imagen: '/images/flan-napolitano.jpg',
        ingredientes: ['Huevos', 'Leche', 'Azúcar', 'Vainilla']
      },
      {
        id: 12,
        nombre: 'Gelatina de Mosaico',
        tipo: 'producto',
        categoria: 'postres',
        precio: 25.00,
        descripcion: 'Gelatina de colores con leche condensada',
        disponible: true,
        imagen: '/images/gelatina-mosaico.jpg',
        ingredientes: ['Gelatina de colores', 'Leche condensada', 'Crema']
      },
      {
        id: 13,
        nombre: 'Tres Leches',
        tipo: 'producto',
        categoria: 'postres',
        precio: 32.00,
        descripcion: 'Pastel tres leches con canela',
        disponible: true,
        imagen: '/images/tres-leches.jpg',
        ingredientes: ['Bizcocho', 'Leche condensada', 'Leche evaporada', 'Crema', 'Canela']
      },

      // Antojitos
      {
        id: 14,
        nombre: 'Elote Desgranado',
        tipo: 'producto',
        categoria: 'antojitos',
        precio: 25.00,
        descripcion: 'Elote desgranado con mayonesa, queso y chile',
        disponible: true,
        imagen: '/images/elote-desgranado.jpg',
        ingredientes: ['Granos de elote', 'Mayonesa', 'Queso cotija', 'Chile piquín', 'Limón']
      },
      {
        id: 15,
        nombre: 'Chicharrones Preparados',
        tipo: 'producto',
        categoria: 'antojitos',
        precio: 30.00,
        descripcion: 'Chicharrones con verduras y salsa picante',
        disponible: false,
        imagen: '/images/chicharrones-preparados.jpg',
        ingredientes: ['Chicharrones', 'Pepino', 'Jícama', 'Zanahoria', 'Cebolla', 'Salsa valentina']
      },
      {
        id: 16,
        nombre: 'Nachos con Queso',
        tipo: 'producto',
        categoria: 'antojitos',
        precio: 35.00,
        descripcion: 'Nachos crujientes con queso derretido y jalapeños',
        disponible: true,
        imagen: '/images/nachos-queso.jpg',
        ingredientes: ['Totopos', 'Queso cheddar', 'Jalapeños', 'Pico de gallo']
      }
    ];

    setItems(itemsCatalogo);
  }, []);

  // Filtrar items
  const itemsFiltrados = items.filter(item => {
    const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            item.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    
    if (filtro === 'todos') return coincideBusqueda;
    if (filtro === 'platillos') return item.tipo === 'platillo' && coincideBusqueda;
    if (filtro === 'productos') return item.tipo === 'producto' && coincideBusqueda;
    if (filtro === 'disponibles') return item.disponible && coincideBusqueda;
    
    return item.categoria === filtro && coincideBusqueda;
  });

  const handleAgregarItem = (item) => {
    if (onAgregarItem && ordenActiva) {
      onAgregarItem(item);
    }
  };

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <h2>Catálogo de Alimentos</h2>
        <div className="catalogo-controles">
          <div className="busqueda-container">
            <input
              type="text"
              placeholder="Buscar platillos o productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="busqueda-input"
            />
          </div>
          <div className="filtros-container">
            <select 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">Todos los items</option>
              <option value="platillos">Solo Platillos</option>
              <option value="productos">Solo Productos</option>
              <option value="principales">Platillos Principales</option>
              <option value="sopas">Sopas</option>
              <option value="ensaladas">Ensaladas</option>
              <option value="bebidas">Bebidas</option>
              <option value="postres">Postres</option>
              <option value="antojitos">Antojitos</option>
              <option value="disponibles">Solo Disponibles</option>
            </select>
          </div>
        </div>
      </div>

      <div className="catalogo-stats">
        <span className="stats-item">Total de items: {items.length}</span>
        <span className="stats-item">Mostrados: {itemsFiltrados.length}</span>
        <span className="stats-item">Disponibles: {items.filter(item => item.disponible).length}</span>
      </div>

      <div className="catalogo-grid">
        {itemsFiltrados.map(item => (
          <div key={item.id} className={`item-card ${!item.disponible ? 'no-disponible' : ''}`}>
            <div className="item-image">
              <div className="placeholder-image">
                📷
              </div>
              <div className="item-tipo">
                {item.tipo === 'platillo' ? '🍽️' : '🥤'}
              </div>
            </div>
            
            <div className="item-info">
              <h3 className="item-nombre">{item.nombre}</h3>
              <p className="item-categoria">{item.categoria}</p>
              <p className="item-descripcion">{item.descripcion}</p>
              
              <div className="item-ingredientes">
                <strong>Ingredientes:</strong>
                <div className="ingredientes-list">
                  {item.ingredientes.slice(0, 3).map((ingrediente, index) => (
                    <span key={index} className="ingrediente-tag">
                      {ingrediente}
                    </span>
                  ))}
                  {item.ingredientes.length > 3 && (
                    <span className="ingredientes-mas">
                      +{item.ingredientes.length - 3} más
                    </span>
                  )}
                </div>
              </div>
              
              <div className="item-footer">
                <div className="item-precio">
                  ${item.precio.toFixed(2)}
                </div>
                <div className="item-estado">
                  {item.disponible ? (
                    <span className="disponible">✅ Disponible</span>
                  ) : (
                    <span className="no-disponible">❌ No disponible</span>
                  )}
                </div>
              </div>
              
              {ordenActiva && item.disponible && (
                <button 
                  className="btn-agregar"
                  onClick={() => handleAgregarItem(item)}
                >
                  Agregar a Orden
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {itemsFiltrados.length === 0 && (
        <div className="no-resultados">
          <p>No se encontraron items que coincidan con tu búsqueda.</p>
          <button 
            className="btn-limpiar"
            onClick={() => {
              setBusqueda('');
              setFiltro('todos');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalogo;