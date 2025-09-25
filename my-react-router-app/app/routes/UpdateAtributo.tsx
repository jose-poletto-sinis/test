import { useNavigate } from "react-router";
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
            <Dialog title={'Modificar Atributo'} onClose={() => { window.dispatchEvent(new Event('reload-atributos')); navigate(-1); }} style={{ minWidth: 200 }}>
                <div style={{ maxHeight: '90vh', overflowY: 'auto', paddingRight: 8 }}>
                    <AtributoForm />
                </div>
                <DialogActionsBar>
                    <Button type="button" onClick={() => { window.dispatchEvent(new Event('reload-atributos')); navigate(-1); }}>
                        Cerrar
                    </Button>
                </DialogActionsBar>
            </Dialog>
        </>
    );
}