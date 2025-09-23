import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Label } from "@radix-ui/react-label"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"

export function loader() {
  return null
}

type LoginFormProps = {
  loaderData?: any
  actionData?: any
} & React.ComponentProps<"div">

export function LoginForm({
  className,
  loaderData,
  actionData,
  ...rest
}: LoginFormProps) {
  const [titulo, setTitulo] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [codUsr, setCodUsr] = useState("")
  const [passWord, setPassWord] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTitulo = async () => {
      try {
        const res = await fetch("/api/Contexto/Contexto/GetPreLoginInfo", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })
        if (!res.ok) throw new Error("Error en la solicitud")
        const data = await res.json()
        setTitulo(data.titulo || "Sistema")
      } catch (error) {
        console.error("Error al obtener el título:", error)
        setTitulo("Sistema")
      } finally {
        setLoading(false)
      }
    }
    fetchTitulo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/Contexto/Contexto/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          codUsr,
          passWord,
          loginAnonimo: false,
        }),
      })
      if (!res.ok) throw new Error("Login fallido")
      const data = await res.json()

if (data?.sessionId) {
  localStorage.setItem("access_token", data.sessionId)
}

      console.log("Login exitoso:", data)
      navigate("/") // ✅ Redirigir al home
    } catch (error) {
      console.error("Error en login:", error)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...rest}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                {loading ? (
                  <h1 className="text-2xl font-bold">Cargando...</h1>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{titulo}</h1>
                    <p className="text-balance text-muted-foreground">
                      Inicia sesión para continuar
                    </p>
                  </>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="codUsr">Código de usuario</Label>
                <Input
                  id="codUsr"
                  type="text"
                  placeholder="Código de usuario"
                  required
                  value={codUsr}
                  onChange={(e) => setCodUsr(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="passWord">Contraseña</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="passWord"
                  type="password"
                  placeholder="Contraseña"
                  required
                  value={passWord}
                  onChange={(e) => setPassWord(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block rounded-xl overflow-hidden h-full">
            <img
              src="https://kchcomunicacion.com/wp-content/uploads/2025/04/IMG_5578.jpeg"
              alt="Image"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
              style={{ minHeight: "350px", borderRadius: "1rem" }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage(props: LoginFormProps) {
  return <LoginForm {...props} />
}
