import { useState, useEffect } from "react"
import { useParams } from "react-router";
import { Label } from "@progress/kendo-react-labels"
import {
  Input,
  NumericTextBox,
  Checkbox,
  TextArea,
} from "@progress/kendo-react-inputs"
import { DropDownList } from "@progress/kendo-react-dropdowns"
import { Button } from "@progress/kendo-react-buttons"

export default function AtributoForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    idAtributo: id ? Number(id) : 0,
    nombre: "",
    nombreCorto: "",
    tipoValor: "Numerico",
    valorMinimo: "",
    valorMaximo: "",
    valoresPosibles: [] as string[],
    strUniMeds: [""],
    comentario: "",
    activo: true,
  })

  const [unidades, setUnidades] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)
  const [atributos, setAtributos] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/UnidadesMedida/GetUnidadesMedida")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar unidades")
        return res.json()
      })
      .then((data) => {
        const codigos = data.map((u: any) => u.codigo)
        setUnidades(codigos)
      })
      .catch((err) => {
        console.error("Error cargando unidades:", err)
      })
  }, [])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    console.log("Enviando JSON:", JSON.stringify(formData, null, 2))

    try {
      const res = await fetch("/api/Atributos/ActualizarAtributo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Error en la API")
      const data = await res.json()
      setResult(data)

      if (formData.idAtributo === 0) {
        setMessage("✅ Nuevo objeto creado correctamente.")
      } else {
        setMessage("✅ Objeto actualizado correctamente.")
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGetAtributos = async () => {
    setError(null)
    try {
      const res = await fetch("/api/Atributos/GetAtributos")
      if (!res.ok) throw new Error("Error al obtener atributos")
      const data = await res.json()
      setAtributos(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          ABM de Atributos (KendoReact)
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Label>
            ID Atributo
            <NumericTextBox
              value={formData.idAtributo}
              disabled={true}
              format="n0"
              placeholder="0 para crear"
            />
          </Label>

          <Label>
            Nombre
            <Input
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </Label>

          <Label>
            Nombre Corto
            <Input
              value={formData.nombreCorto}
              onChange={(e) => handleChange("nombreCorto", e.target.value)}
            />
          </Label>

          <Label>
            Tipo de Valor
            <DropDownList
              data={["Numerico", "Texto", "Lista"]}
              value={formData.tipoValor}
              onChange={(e) => handleChange("tipoValor", e.value)}
            />
          </Label>

          <Label>
            Valor Mínimo
            <Input
              value={formData.valorMinimo}
              onChange={(e) => handleChange("valorMinimo", e.target.value)}
            />
          </Label>

          <Label>
            Valor Máximo
            <Input
              value={formData.valorMaximo}
              onChange={(e) => handleChange("valorMaximo", e.target.value)}
            />
          </Label>

          <Label>
            Unidad de Medida
            <DropDownList
              data={unidades}
              value={formData.strUniMeds[0] || ""}
              onChange={(e) => handleChange("strUniMeds", [e.value])}
            />
          </Label>

          <Label>
            Comentario
            <TextArea
              value={formData.comentario}
              onChange={(e) => handleChange("comentario", e.value)}
              rows={3}
            />
          </Label>

          <Label>
            <Checkbox
              checked={formData.activo}
              onChange={(e) => handleChange("activo", e.value)}
            />
            Activo
          </Label>

          <Button type="submit" themeColor="primary">
            Guardar
          </Button>
        </form>

        <Button
          onClick={handleGetAtributos}
          themeColor="success"
          className="mt-4"
        >
          📥 Obtener Atributos
        </Button>

        {error && <p className="text-red-600 mt-4">❌ {error}</p>}
        {message && <p className="text-green-700 mt-4">{message}</p>}

        {result && (
          <div className="mt-6 p-4 border rounded bg-gray-100">
            <h2 className="font-bold">Objeto guardado:</h2>
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        {atributos.length > 0 && (
          <div className="mt-6 p-4 border rounded bg-gray-200">
            <h2 className="font-bold mb-2">📋 Lista de Atributos:</h2>
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(atributos, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
