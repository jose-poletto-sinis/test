import { Outlet, useNavigate } from "react-router";
import { Button as UIButton } from "~/components/ui/button";
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import * as React from 'react';
import AtributoForm from "./atributos/modificador-atributos";

export default function UpdateAtributo() {
    const navigate = useNavigate();

    return (
        <>
            <UIButton onClick={() => { navigate(-1) }}>Volver</UIButton>
            <Dialog title={'Modificar Atributo'} onClose={() => navigate(-1)} style={{ minWidth: 360 }}>
                <AtributoForm />
                <DialogActionsBar>
                    <Button type="button" onClick={() => navigate(-1)}>
                        Cerrar
                    </Button>
                </DialogActionsBar>
            </Dialog>
            
        </>
    );
}