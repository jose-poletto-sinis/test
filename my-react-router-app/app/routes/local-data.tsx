import React, { useState, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Loader } from '@progress/kendo-react-indicators';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { Button, ButtonGroup } from '@progress/kendo-react-buttons';
import { Grid as KendoGrid, GridToolbar, GridSearchBox } from '@progress/kendo-react-grid';
import { BudgetCell, ColumnMenu, PersonCell, ProgressCell, RatingCell, CountryCell } from '../components/custom-cells';
import { employees } from './employees';

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
        fetch('/api/Atributos/GetMarcas')
            .then((response) => response.json())
            .then(setUsers)
            .finally(() => setLoading(false));
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
    );
};

const EmployeesGrid = () => {
    let _pdfExport: any;
    let _export: any;

    const exportExcel = () => {
        _export.save();
    };

    const exportPDF = () => {
        _pdfExport.save();
    };

    // Crea dos grids independientes para evitar el error
    const gridChildren = (
        <>
            <GridToolbar>
                <GridSearchBox style={{ width: 210 }} />
                <ButtonGroup>
                    <Button themeColor={'base'} onClick={exportExcel}>
                        Export to Excel
                    </Button>
                    <Button themeColor={'base'} onClick={exportPDF}>
                        Export to PDF
                    </Button>
                </ButtonGroup>
            </GridToolbar>
            <Column filterable={false} groupable={false} width={50} columnType="checkbox" />
            <Column title="Employee" groupable={false} sortable={false}>
                <Column
                    field="full_name"
                    title="Contact Name"
                    columnMenu={ColumnMenu}
                    cells={{
                        data: PersonCell
                    }}
                    width="250px"
                />
                <Column field="job_title" title="Job Title" columnMenu={ColumnMenu} width="220px" />
                <Column
                    field="country"
                    title="Country"
                    cells={{
                        data: CountryCell
                    }}
                    columnMenu={ColumnMenu}
                    width="120px"
                />
            </Column>
            <Column title="Performance" groupable={false} sortable={false}>
                <Column
                    field="target"
                    title="Engagement"
                    cells={{
                        data: ProgressCell
                    }}
                    columnMenu={ColumnMenu}
                    width="250px"
                />
                <Column
                    field="budget"
                    title="Budget"
                    columnMenu={ColumnMenu}
                    cells={{
                        data: BudgetCell
                    }}
                    width="150px"
                />
                <Column
                    field="rating"
                    title="Rating"
                    cells={{
                        data: RatingCell
                    }}
                    columnMenu={ColumnMenu}
                    width="230px"
                />
            </Column>
            <Column title="Contacts" groupable={false} sortable={false}>
                <Column field="phone" title="Phone" columnMenu={ColumnMenu} width="230px" />
                <Column field="address" title="Address" columnMenu={ColumnMenu} width="230px" />
            </Column>
        </>
    );

    return (
        <>
            <ExcelExport
                data={employees}
                ref={(exporter) => {
                    _export = exporter;
                }}
            >
                <KendoGrid
                    style={{ height: '670px' }}
                    dataItemKey={DATA_ITEM_KEY}
                    data={employees}
                    autoProcessData={true}
                    sortable={true}
                    defaultGroup={[{ field: 'job_title' }]}
                    pageable={{ pageSizes: true }}
                    groupable={true}
                    selectable={true}
                    rowSpannable={{ valueGetter: (dataItem: any, field: string) => `${dataItem.job_title}-${dataItem[field]}` }}
                    defaultTake={10}
                    defaultSkip={0}
                >
                    {gridChildren}
                </KendoGrid>
            </ExcelExport>
            <GridPDFExport
                margin="1cm"
                ref={(element) => {
                    _pdfExport = element;
                }}
            >
                <KendoGrid
                    style={{ height: '670px' }}
                    dataItemKey={DATA_ITEM_KEY}
                    data={employees}
                    autoProcessData={true}
                    sortable={true}
                    defaultGroup={[{ field: 'job_title' }]}
                    pageable={{ pageSizes: true }}
                    groupable={true}
                    selectable={true}
                    rowSpannable={{ valueGetter: (dataItem: any, field: string) => `${dataItem.job_title}-${dataItem[field]}` }}
                    defaultTake={10}
                    defaultSkip={0}
                >
                    {gridChildren}
                </KendoGrid>
            </GridPDFExport>
        </>
    );
};

const App = () => (
    <>
        <LocalDataGrid />
        <EmployeesGrid />
    </>
);

export default App;