import { useEffect, useState } from "react"
import BackgroundPaths from "~/components/background-paths"

export default function HomePage() {
  const [titulo, setTitulo] = useState("Cargando...")
  const [loading, setLoading] = useState(true)
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")

    if (!token) {
      setTitulo("Logueese para continuar")
      setIsLogged(false)
      setLoading(false)
      return
    }

    const fetchTitulo = async () => {
      try {
        const res = await fetch("/api/Contexto/Contexto/GetPreLoginInfo", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Error en la solicitud")
        const data = await res.json()
        setTitulo(data.titulo || "Sistema")
        setIsLogged(true)
      } catch (error) {
        console.error("Error al obtener el título:", error)
        setTitulo("Sistema")
        setIsLogged(false)
      } finally {
        setLoading(false)
      }
    }

    fetchTitulo()
  }, [])

  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 space-y-6">
      {/* fondo con el título y botón dinámico */}
      <BackgroundPaths title={titulo} />
    </div>
  )
}
