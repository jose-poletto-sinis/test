import { Outlet, useLoaderData, useNavigate } from "react-router";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";

export const loader = async () => {

    const response = await fetch("https://appcms.desarrollo.dnscheck.com.ar/Atributos/GetAtributos", {
        method: "GET"
    });
    const atributosData = await response.json();

    return { atributosData };
}


const CellButton = (props: any) => {
    const { dataItem } = props;

    return (
        <td {...props.tdProps} style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <button
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                style={{ backgroundColor: '#4CAF50', color: 'white' }}
                onClick={() => alert(`Editando el registro con ID: ${dataItem.idAtributo}`)}
            >
                Editar
            </button>
            <button
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                style={{ backgroundColor: '#f44336', color: 'white' }}
                onClick={() => alert(`Eliminando el registro con ID: ${dataItem.idAtributo}`)}
            >
                Eliminar
            </button>
        </td>
    );
}

export default function Component() {
    const { atributosData } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    return <>
        <h1>Atributos</h1>
        <div>
            <Grid
                style={{ height: '475px', padding: '10px' }}
                data={atributosData}
                dataItemKey="idAtributo"
                autoProcessData={true}
                sortable={true}
                pageable={true}
                filterable={true}
                editable={{ mode: 'incell' }}
                defaultSkip={0}
                defaultTake={10}
            >
                <GridToolbar>
                    <button
                        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                        style={{ backgroundColor: '#008CBA', color: 'white' }}
                        onClick={() => navigate("updateAtributo/0")}
                    >
                        Añadir Nuevo Atributo
                    </button>
                </GridToolbar>

                <Column field="idAtributo" title="ID" editable={false} filterable={false} width="75px" />
                <Column field="nombre" title="Nombre" editor="text" />
                <Column field="nombreCorto" title="Nombre Corto" editor="text" />
                <Column field="tipoValor" title="Tipo Valor" editor="text" />
                <Column field="valorMinimo" title="Valor Mínimo" editor="text" />
                <Column field="valorMaximo" title="Valor Máximo" editor="text" />
                <Column field="comentario" title="Comentario" editor="text" />
                <Column field="activo" title="Activo" editor="boolean" width="100px" />
                <Column cells={{ data: CellButton }} title="Acciones" width="180px" />
            </Grid>
        </div>
        <Outlet />
    </>
}
