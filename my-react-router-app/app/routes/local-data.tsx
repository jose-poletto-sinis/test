import React, { useState, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Loader } from '@progress/kendo-react-indicators';
import { Outlet, useNavigate } from 'react-router';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import EliminarAtributo from './atributos/eliminar-atribuoto';
import type { JSX } from 'react/jsx-runtime';

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
    const [showEliminarDialog, setShowEliminarDialog] = useState(false);

    async function loadUsers() {
        setLoading(true);
        console.log('🔄 Iniciando fetch de datos...');
        try {
            const response = await fetch('/api/Atributos/GetAtributos');
            console.log('📥 Respuesta recibida de la API:', response);
            const data = await response.json();
            console.log('✅ Datos parseados:', data);

            if (!Array.isArray(data)) {
                console.error('❌ La respuesta no es un array:', data);
                setUsers([]);
            } else {
                console.log('🧾 Primer elemento:', data[0]);
                const sanitized = data.map((item, index) => ({
                    ...item,
                    codigo: typeof item.codigo === 'object' ? JSON.stringify(item.codigo) : item.codigo,
                    nombre: typeof item.nombre === 'object' ? JSON.stringify(item.nombre) : item.nombre,
                    activo: typeof item.activo === 'object' ? JSON.stringify(item.activo) : item.activo,
                    codigoNombre: typeof item.codigoNombre === 'object' ? JSON.stringify(item.codigoNombre) : item.codigoNombre,
                    nuevaColumna: index + 1
                }));
                console.log('✅ Datos sanitizados para el grid:', sanitized);
                setUsers(sanitized);
            }
        } catch (err) {
            console.error('💥 Error al cargar datos:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
        function handleReloadEvent() {
            loadUsers();
        }
        window.addEventListener('reload-atributos', handleReloadEvent);
        return () => {
            window.removeEventListener('reload-atributos', handleReloadEvent);
        };
    }, []);

    const CustomNuevaCell = (props: any) => {
        const {dataItem} = props;
        const id = props?.dataItem?.idAtributo;
        const onDelete = async () => {
            if (id === undefined || id === null) return;
            try {
                await fetch(`/api/Atributos/DeleteAtributo/IdAtributo/${encodeURIComponent(String(id))}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (e) {
                console.error('Error eliminando atributo', e);
            } finally {
                loadUsers();
            }
        };
        return (
            <td {...props.tdProps}>
                <button
                    type="button"
                    onClick={() => navigate(`eliminar/${dataItem.idAtributo}`)}
                    style={{ padding: '6px 10px', background: '#e53935', color: '#fff', border: '1px solid #b71c1c', borderRadius: 4 }}
                >
                    Eliminar
                </button>
            </td>
        );
    };
    const CustomNuevaColumnaCell = (props: any) => {
        return (
            <td {...props.tdProps} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {props.dataItem.nuevaColumna}
            </td>
        );
    };

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
                <button
                    style={{
                        padding: '4px 10px',
                        fontSize: '0.95rem',
                        borderRadius: 5,
                        border: '1px solid #f5f5f5',
                        background: '#ffecec',
                        cursor: 'pointer',
                        transition: 'transform 0.15s',
                        minWidth: 0,
                    }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.12)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                    onClick={() => setShowEliminarDialog(true)}
                >
                    eliminar atributo
                </button>
            </div>
            <Grid
                loader={customLoader}
                showLoader={loading}
                style={{ height: '400px', marginBottom: 40 }}
                data={users}
            >
                <Column field="idAtributo" title="ID" width="70px" />
                <Column title="Nueva" width="120px"  cells={{ data: CustomNuevaCell }} />
                <Column field="nuevaColumna" title="#" width="70px" cells={{ data: CustomNuevaColumnaCell }} />
                <Column field="nombre" title="Nombre" width="250px" />
                <Column field="nombreCorto" title="Nom corto" />
                <Column field="tipoValor" title="Tipo valor" />
                <Column field="valorMinimo" title="Valor Min" />
                <Column field="valorMaximo" title="Valor Max" />
                <Column field="strUniMeds" title="Unidad med" width="200px" />
                <Column field="comentario" title="Comentario" />
                <Column field="activo" title="activo" width="70px"/>

            </Grid>
            {showEliminarDialog && (
                <Dialog title={'Eliminar Atributo'} onClose={() => { setShowEliminarDialog(false); loadUsers(); }} style={{ minWidth: 360 }}>
                    <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: 8 }}>
                        <EliminarAtributo />
                    </div>
                    <DialogActionsBar>
                        <button type="button" onClick={() => { setShowEliminarDialog(false); loadUsers(); }}>Cerrar</button>
                    </DialogActionsBar>
                </Dialog>
            )}
            <Outlet />
        </>
    );
};

export default LocalDataGrid;
