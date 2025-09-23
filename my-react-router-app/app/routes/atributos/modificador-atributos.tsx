import { useState, useEffect } from "react"

export default function AtributoForm() {
  const [formData, setFormData] = useState({
    idAtributo: 0,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUnidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unidadSeleccionada = e.target.value
    setFormData((prev) => ({
      ...prev,
      strUniMeds: [unidadSeleccionada],
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
    <div className="min-h-screen bg-yellow-500 text-black p-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          ABM de Atributos
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="number"
            name="idAtributo"
            placeholder="ID (0 para crear)"
            value={formData.idAtributo}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />
          <input
            type="text"
            name="nombreCorto"
            placeholder="Nombre Corto"
            value={formData.nombreCorto}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />
          <select
            name="tipoValor"
            value={formData.tipoValor}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          >
            <option value="Numerico">Numérico</option>
            <option value="Texto">Texto</option>
            <option value="Lista">Lista</option>
          </select>
          <input
            type="text"
            name="valorMinimo"
            placeholder="Valor Mínimo"
            value={formData.valorMinimo}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />
          <input
            type="text"
            name="valorMaximo"
            placeholder="Valor Máximo"
            value={formData.valorMaximo}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />
          <select
            value={formData.strUniMeds[0] || ""}
            onChange={handleUnidadChange}
            className="border border-black p-2 rounded"
          >
            <option value="">Seleccione una unidad</option>
            {unidades.map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="comentario"
            placeholder="Comentario"
            value={formData.comentario}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, activo: e.target.checked }))
              }
            />
            Activo
          </label>

          {/* Botón Guardar */}
          <button
            type="submit"
            className="border border-black px-4 py-2 rounded font-bold 
                       hover:bg-blue-500 hover:text-white transition-colors"
          >
            Guardar
          </button>
        </form>

        {/* Botón Obtener Atributos */}
        <button
          onClick={handleGetAtributos}
          className="border border-black px-4 py-2 rounded font-bold mt-4
                     hover:bg-green-500 hover:text-white transition-colors"
        >
          📥 Obtener Atributos
        </button>

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
