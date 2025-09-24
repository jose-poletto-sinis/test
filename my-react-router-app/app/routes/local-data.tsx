import React, { useState, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Loader } from '@progress/kendo-react-indicators';

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

    useEffect(() => {
        setLoading(true);
        console.log('🔄 Iniciando fetch de datos...');

        fetch('/api/Atributos/GetMarcas')
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
            <h2>📊 Local Data Grid</h2>
            <Grid
                loader={customLoader}
                showLoader={loading}
                style={{ height: '400px', marginBottom: 40 }}
                data={users}
            >
                <Column field="idMarcaProduct" title="ID" width="40px" />
                <Column field="codigo" title="Name" width="250px" />
                <Column field="nombre" title="Email" />
                <Column field="activo" title="Address" />
                <Column field="codigoNombre" title="Zipcode" />
            </Grid>
        </>
    );
};

export default LocalDataGrid;
