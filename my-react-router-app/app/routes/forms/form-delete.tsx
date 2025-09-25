import React from "react";
import { useParams, useNavigate, Outlet } from "react-router";

const FormDelete = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	return (
		<div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8, textAlign: "center" }}>
			<h2>Eliminar atributo</h2>
			<p>¿Seguro que quieres eliminar el ítem número: <strong>{id}</strong>?</p>
			<div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 24 }}>
				<button
					style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 4, padding: "8px 18px", cursor: "pointer" }}
					onClick={() => {/* Aquí iría la lógica de eliminación */}}
				>Aceptar</button>
				<button
					style={{ background: "#43a047", color: "#fff", border: "none", borderRadius: 4, padding: "8px 18px", cursor: "pointer" }}
					onClick={() => navigate(-1)}
				>Rechazar</button>
			</div>
		</div>
	);
};

export default FormDelete;
