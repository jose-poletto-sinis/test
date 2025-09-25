import React, { useState, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Loader } from '@progress/kendo-react-indicators';
import { Outlet, useNavigate } from 'react-router';

// 🎯 Estilos para el loader
const styles = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const DATA_ITEM_KEY = 'id';

const LocalDataGrid = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        console.log('🔄 Iniciando fetch de datos...');

        fetch('/api/Atributos/GetAtributos')
            .then((response) => {
                console.log('📥 Respuesta recibida de la API:', response);
                return response.json();
            })
            .then((data) => {
                console.log('✅ Datos parseados:', data);

                // 🧼 Verifica si los datos son un array
                if (!Array.isArray(data)) {
                    console.error('❌ La respuesta no es un array:', data);
                    setUsers([]);
                } else {
                    // 🧪 Muestra uno de los items en detalle
                    console.log('🧾 Primer elemento:', data[0]);

                    // ✅ Aquí podrías transformar los campos si es necesario
                    const sanitized = data.map((item) => ({
                        ...item,
                        // 🕵️‍♀️ Asegúrate de que estos campos sean primitivos (no objetos)
                        codigo: typeof item.codigo === 'object' ? JSON.stringify(item.codigo) : item.codigo,
                        nombre: typeof item.nombre === 'object' ? JSON.stringify(item.nombre) : item.nombre,
                        activo: typeof item.activo === 'object' ? JSON.stringify(item.activo) : item.activo,
                        codigoNombre: typeof item.codigoNombre === 'object' ? JSON.stringify(item.codigoNombre) : item.codigoNombre,
                    }));

                    console.log('✅ Datos sanitizados para el grid:', sanitized);
                    setUsers(sanitized);
                }
            })
            .catch((err) => {
                console.error('💥 Error al cargar datos:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const customLoader = (
        <div className="k-loading-mask">
            <div className="k-loading-color" />
            <div style={styles}>
                <Loader size="large" type="pulsing" />
                <span style={{ fontSize: '1.25rem' }}>Cargando datos...</span>
            </div>
        </div>
    );

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h2 style={{ margin: 0 }}>📊 Local Data Grid</h2>
                <button
                    style={{
                        padding: '4px 10px',
                        fontSize: '0.95rem',
                        borderRadius: 5,
                        border: '1px solid #ccc',
                        background: '#f5f5f5',
                        cursor: 'pointer',
                        transition: 'transform 0.15s',
                        minWidth: 0,
                    }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.12)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                    onClick={() => {
                        // Aquí puedes manejar la lógica para abrir el popup
                        navigate('nuevo');
                    }}
                >
                    cargar nuevo atributo
                </button>
            </div>
            <Grid
                loader={customLoader}
                showLoader={loading}
                style={{ height: '400px', marginBottom: 40 }}
                data={users}
            >
                <Column field="idAtributo" title="ID" width="40px" />
                <Column field="nombre" title="Nombre" width="250px" />
                <Column field="nombreCorto" title="Nom corto" />
                <Column field="tipoValor" title="Tipo valor" />
                <Column field="valorMinimo" title="Valor Min" />
                <Column field="valorMaximo" title="Valor Max" />
                <Column field="strUniMeds" title="Valor Max" />
                <Column field="comentario" title="Comentario" />
                <Column field="activo" title="activo" />
            </Grid>
            <Outlet />
        </>
    );
};

export default LocalDataGrid;
