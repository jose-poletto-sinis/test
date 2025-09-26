import React from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog } from '@progress/kendo-react-dialogs';

const FormDelete = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const reloadAndClose = () => {
		window.dispatchEvent(new Event('reload-atributos'));
		navigate(-1);
	};

	const handleDelete = async () => {
		if (!id) return;
		try {
			await fetch(`/api/Atributos/DeleteAtributo/IdAtributo/${encodeURIComponent(id)}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			});
			reloadAndClose();
		} catch (e) {
			alert('Error al eliminar el atributo');
		}
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
			</div>
		</Dialog>
	);
};

export default FormDelete;
