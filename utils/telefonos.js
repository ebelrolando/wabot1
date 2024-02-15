import fs from 'fs';

const archivoJSON = './telefonos.json'; // Nombre del archivo JSON predeterminado

// Función para buscar un número de teléfono y agregarlo al JSON
export function agregarTelefono(numero) {
  try {
    let telefonos;
    if (fs.existsSync(archivoJSON)) {
      const data = fs.readFileSync(archivoJSON, 'utf8');
      telefonos = JSON.parse(data);
    } else {
      telefonos = {};
    }

    if (telefonos.hasOwnProperty(numero)) {
      return false; // El número ya existe en el JSON
    } else {
      telefonos[numero] = true;
      fs.writeFileSync(archivoJSON, JSON.stringify(telefonos, null, 2));
      return true; // Número agregado con éxito
    }
  } catch (error) {
    console.error('Error al agregar/buscar el número de teléfono:', error);
    return false;
  }
}
