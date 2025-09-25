import * as React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button as UIButton } from "~/components/ui/button";

export default function EliminarAtributo() {
	const [atributoIdInput, setAtributoIdInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
	const navigate = useNavigate();
    const { idAtributo } = useParams();
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		setFeedbackMessage(null);
		const trimmedId = atributoIdInput.trim();
		if (!trimmedId) {
			setFeedbackMessage("Ingresá un IdAtributo.");
			return;
		}
		setIsSubmitting(true);
		try {
			const response = await fetch(`/api/Atributos/DeleteAtributo/IdAtributo/${encodeURIComponent(trimmedId)}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			});
			if (!response.ok) {
				const text = await response.text();
				throw new Error(text || `Error ${response.status}`);
			}
			setFeedbackMessage("Atributo eliminado correctamente.");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Error desconocido";
			setFeedbackMessage(`No se pudo eliminar: ${message}`);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div style={{ padding: 16, maxWidth: 480 }}>
			
			
			<form onSubmit={handleSubmit} style={{ marginTop: 12, display: "grid", gap: 12 }}>
				<label htmlFor="atributoIdInput">IdAtributo</label>
				<input
					id="atributoIdInput"
                    readOnly
					type="text"
					value={idAtributo}
					onChange={(e) => setAtributoIdInput(e.target.value)}
					placeholder="Ej: 123"
					style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
				/>
				<div style={{ display: "flex", gap: 8 }}>
					<button type="submit" disabled={isSubmitting} style={{ padding: "8px 12px" }}>
						{isSubmitting ? "Eliminando..." : "Eliminar"}
					</button>
				</div>
				{feedbackMessage && (
					<div style={{ marginTop: 8 }}>{feedbackMessage}</div>
				)}
			</form>
		</div>
	);
}


