async function loadUsers() {
  try {
    const respuesta = await fetch("/api/usrs");
    if (!respuesta.ok) {
      throw new Error("Error al obtener los datos");
    }
    const datosJson = await respuesta.json();
    return datosJson;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const data = await loadUsers();
