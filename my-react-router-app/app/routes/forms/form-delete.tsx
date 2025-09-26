import React from "react";
import { useParams, useNavigate, redirect, useActionData } from "react-router";
import { Dialog } from '@progress/kendo-react-dialogs';


export const action = async ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const resultado = await fetch(`https://appcms.desarrollo.dnscheck.com.ar/Atributos/DeleteAtributo/IdAtributo/${encodeURIComponent(id)}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' }
	});

	if (!resultado.ok) {
		return { status: resultado.status, statusText: 'Error al eliminar el atributo' };
	}
	return redirect('/lista-atributos');
}


const FormDelete = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { status, statusText } = useActionData() || {};

	const reloadAndClose = () => {
		window.dispatchEvent(new Event('reload-atributos'));
		navigate(-1);
	};

	const handleDelete = async () => {
			const form = document.createElement('form');
			form.method = 'post';
			form.action = `/forms/form-delete/${id}`;
			document.body.appendChild(form);
			form.submit();
	};

	return (
		<Dialog title="Eliminar atributo" onClose={reloadAndClose}>
			<div style={{ maxWidth: 400, padding: 24, textAlign: "center" }}>
				<p>¿Seguro que quieres eliminar el ítem número: <strong>{id}</strong>?</p>
				<div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 24 }}>
					<button
						style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 4, padding: "8px 18px", cursor: "pointer" }}
						onClick={handleDelete}
					>Aceptar</button>
					<button
						style={{ background: "#43a047", color: "#fff", border: "none", borderRadius: 4, padding: "8px 18px", cursor: "pointer" }}
						onClick={reloadAndClose}
					>Rechazar</button>
				</div>
				{status && (
					<p style={{ color: 'red', marginTop: 16 }}>
						{statusText} (Código: {status})
					</p>
				)}
			</div>
		</Dialog>
	);
};

export default FormDelete;
