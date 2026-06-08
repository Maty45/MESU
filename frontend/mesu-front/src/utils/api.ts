const BASE_URL = "http://localhost:8080";

export async function api(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API Error");
  }

  return response.json();
}

//esto es un fetch inteligente, DESPUES DE LA CREACION DE USUARIOS CON ROL ADMIN VUELVO A ESTO
