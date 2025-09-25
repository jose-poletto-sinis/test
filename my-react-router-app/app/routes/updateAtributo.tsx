import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { redirect, useActionData, useLoaderData, useNavigate, useParams, useSubmit } from 'react-router';
import { Form, Field, FormElement, FormFieldSet, FormSeparator, type FormRenderProps } from '@progress/kendo-react-form';
import { FormCheckbox, FormComboBox, FormDatePicker, FormInput, FormMaskedTextBox, FormNumericTextBox, FormTextArea } from '~/components/shared-fm-form-components';
import React from 'react';

//BACK
export const loader = async () => {
    const res = await fetch("https://appcms.desarrollo.dnscheck.com.ar/UnidadesMedida/GetUnidadesMedida");
    const unidadesMedida = await res.json();
    return { unidadesMedida };
}

export const action = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const idAtributo = Number(formData.get("idAtributo"));
    const nombre = formData.get("nombre") as string;
    const nombreCorto = formData.get("nombreCorto") as string;
    const tipoValor = formData.get("tipoValor") as string;
    const valorMinimo = formData.get("valorMinimo") as string;
    const valorMaximo = formData.get("valorMaximo") as string;
    const valoresPosibles = (formData.get("valoresPosibles") as string || "")
        .split(",")
        .map(v => v.trim())
        .filter(v => v.length > 0);
    const strUniMeds = [(formData.get("unidad") as string || "")]
    const comentario = formData.get("comentario") as string;
    const activo = formData.get("activo") === "on";

    const payload = {
        idAtributo,
        nombre,
        nombreCorto,
        tipoValor,
        valorMinimo,
        valorMaximo,
        valoresPosibles,
        strUniMeds,
        comentario: comentario ? comentario : "",
        activo
    };

    const playLoadJson = JSON.stringify(payload);

    const response = await fetch("https://appcms.desarrollo.dnscheck.com.ar/Atributos/ActualizarAtributo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: playLoadJson
    });

    if (!response.ok) {
        return { error: "Error updating attribute" };
    }
    return redirect("/atributos");
}


//FRONT
export default function Component() {
    const { unidadesMedida } = useLoaderData();
    const { error } = useActionData() as { error?: string } || {};
    const navigate = useNavigate();
    const submit = useSubmit();
    const {idAtributo} = useParams();

    const [unidad, setUnidad] = React.useState<string>('');

    const handleChangeComboBox = (event: any) => {
        setUnidad(event.target.value.codigo);
    }

    return <Dialog title={'Please confirm'} onClose={() => navigate(-1)}>
        <div style={{ overflow: "scroll", height: "70vh", width: "500px", padding: "20px" }}>
            <h1>Actualizar Atributo</h1>
            <Form
                onSubmit={(event) => {
                    console.log(event);
                    const formData = new FormData();
                    Object.entries(event).forEach(([key, value]) => {
                        formData.append(key, value as string);
                    });
                    formData.append("idAtributo", idAtributo ? (idAtributo) : "0");
                    formData.append("unidad", unidad);
                    submit(formData, { method: "post" });
                }}
                render={(formRenderProps: FormRenderProps) => (
                    <FormElement style={{ width: "100%" }}>
                        <FormFieldSet legend="Actualizar Atributo">
                            {/* <Field
                                id={'idAtributo'}
                                name={'idAtributo'}
                                label={'ID Atributo'}
                                component={FormNumericTextBox}
                                format={'n0'}
                                value={idAtributo ? Number(idAtributo) : 0}
                                readOnly={true} 
                            /> */}
                            <Field
                                id={'nombre'}
                                name={'nombre'}
                                label={'Nombre'}
                                component={FormInput}
                            />
                            <Field
                                id={'nombreCorto'}
                                name={'nombreCorto'}
                                label={'Nombre Corto'}
                                component={FormInput}
                            />
                            <Field
                                id={'tipoValor'}
                                name={'tipoValor'}
                                label={'Tipo de Valor'}
                                component={FormInput}
                            />
                            <Field
                                id={'valorMinimo'}
                                name={'valorMinimo'}
                                label={'Valor Mínimo'}
                                component={FormInput}
                            />
                            <Field
                                id={'valorMaximo'}
                                name={'valorMaximo'}
                                label={'Valor Máximo'}
                                component={FormInput}
                            />
                            <Field
                                id={'valoresPosibles'}
                                name={'valoresPosibles'}
                                label={'Valores Posibles (separados por coma)'}
                                component={FormInput}
                                hint={'Ejemplo: valor1,valor2,valor3'}
                            />
                            <Field
                                id={'strUniMeds'}
                                name={'strUniMeds'}
                                label={'Unidades de Medida (separadas por coma)'}
                                component={FormComboBox}
                                data={unidadesMedida}
                                onChange={handleChangeComboBox}
                                textField={'codigo'}

                                hint={'Ejemplo: unidad1,unidad2'}
                            />
                            <Field
                                id={'comentario'}
                                name={'comentario'}
                                label={'Comentario'}
                                value={''}
                                component={FormTextArea}
                                optional={true}
                            />
                            <Field
                                id={'activo'}
                                name={'activo'}
                                label={'Activo'}
                                component={FormCheckbox}
                            />
                            <FormSeparator />
                            <div className="k-form-buttons">
                                <Button themeColor={'primary'} type={'submit'} disabled={!formRenderProps.allowSubmit}>
                                    Actualizar
                                </Button>
                                <Button onClick={formRenderProps.onFormReset}>Limpiar</Button>
                            </div>
                        </FormFieldSet>
                    </FormElement>
                )}
            />
        </div>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {/* <DialogActionsBar>
            <button onClick={() => navigate(-1)}>Cancel</button>
            <button onClick={() => {/* Handle confirm action }>Confirm</button>
        </DialogActionsBar> */}
    </Dialog>;
}