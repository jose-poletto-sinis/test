import React, { useState, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Outlet, useNavigate } from 'react-router';
import { Dialog } from '@progress/kendo-react-dialogs';

// Los datos se cargarán desde la API

const ListaAtributos = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar los datos
  const loadData = () => {
    setLoading(true);
    fetch('/api/Atributos/GetAtributos')
      .then(res => res.json())
      .then(json => {
        setData(Array.isArray(json) ? json : []);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // Escucha el evento personalizado para recargar datos
    function handleReloadEvent() {
      loadData();
    }
    window.addEventListener('reload-atributos', handleReloadEvent);
    return () => {
      window.removeEventListener('reload-atributos', handleReloadEvent);
    };
  }, []);

  const navigate = useNavigate();
  // Columna personalizada para botones de Editar y Eliminar
  const CustomActionsCell = (props: any) => (
    <td style={{ textAlign: 'center' }}>
      <button
        style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', marginRight: 8, cursor: 'pointer' }}
        onClick={() => navigate(`updateatributo/${props.dataItem.idAtributo}`)}
      >
        Edit
      </button>
      <button
        style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
        onClick={() => navigate(`delete/${props.dataItem.idAtributo}`)}
      >
        Delete
      </button>
    </td>
  );

  return (
    <>
      <Grid
        style={{ height: '475px' }}
        data={data}
        dataItemKey="idAtributo"
        autoProcessData={true}
        sortable={true}
        pageable={true}
        filterable={true}
        editable={{ mode: 'incell' }}
        defaultSkip={0}
        defaultTake={10}
        onItemChange={() => {}}
      >
        <Column field="idAtributo" title="ID" width="80px" />
        <Column field="nombre" title="Nombre" width="150px" />
        <Column field="nombreCorto" title="Nombre Corto" width="150px" />
        <Column field="tipoValor" title="Tipo Valor" width="120px" />
        <Column field="valorMinimo" title="Valor Mínimo" width="100px" />
        <Column field="valorMaximo" title="Valor Máximo" width="100px" />
        <Column field="strUniMeds" title="Unidades" width="150px" cells={{ data: (props: any) => <td>{Array.isArray(props.dataItem.strUniMeds) ? props.dataItem.strUniMeds.join(", ") : ""}</td> }} />
        <Column field="comentario" title="Comentario" width="150px" />
        <Column field="activo" title="Activo" width="80px" cells={{ data: (props: any) => <td>{props.dataItem.activo ? "Sí" : "No"}</td> }} />

        <Column title="Acciones" width="160px" cells={{ data: CustomActionsCell }} />
      </Grid>
      {/* Aquí se va a desplegar el formulario para cargar un nuevo atributo */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button
          style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 24px', fontSize: '1rem', cursor: 'pointer' }}
          onClick={() => navigate('updateatributo/0')}
        >
          Cargar nuevo atributo
        </button>
      </div>
      <Outlet />
    </>
  );
};

export default ListaAtributos;


