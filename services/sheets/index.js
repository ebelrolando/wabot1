import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

class GoogleSheetService {
  jwtFromEnv = undefined;
  doc = undefined;

  constructor(id = undefined) {
    if (!id) {
      throw new Error("ID_UNDEFINED");
    }

    this.jwtFromEnv = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    });
    this.doc = new GoogleSpreadsheet(id, this.jwtFromEnv);
  }

  /**
   * Recuperar el menu del dia
   * @param {*} dayNumber
   * @returns
   */
  searchAndReturnRowByPhoneNumber = async (phoneNumber) => {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[0]; // La primera hoja
  
      const rows = await sheet.getRows(); // Obtener todas las filas
  
      for (const row of rows) {
        let foundPhoneNumber = false;
        const rowData = {};
  
        for (const [index, value] of row._rawData.entries()) {
          const columnName = sheet.headerValues[index];
          rowData[columnName] = value;
  
          if (value === phoneNumber) {
            foundPhoneNumber = true;
          }
        }
  
        if (foundPhoneNumber) {
          return rowData;
        }
      }
      return null; // Retorna null si no se encuentra el número de teléfono
    } catch (err) {
      console.log("Error:", err);
      return null;
    }
  };
  
  getAllRows = async () => {
    try {
      // Cargar la información del documento de Google Sheets
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[0]; // Obtener la primera hoja
  
      // Obtener todas las filas en la hoja
      const rows = await sheet.getRows();
  
      // Array para almacenar los datos de todas las filas
      const allRows = rows.map((row) => {
        const rowData = {};
        // Iterar a través de cada celda en la fila
        for (const [index, value] of row._rawData.entries()) {
          const columnName = sheet.headerValues[index];
          rowData[columnName] = value;
        }
        return rowData;
      });
  
      // Devolver el array con todos los datos de las filas
      return allRows;
    } catch (err) {
      // Registrar y manejar cualquier error que ocurra durante el proceso
      console.log("Error:", err);
      return null;
    }
  };

  getSpecificRow = async (rowNumber) => {
    try {
      // Cargar la información del documento de Google Sheets
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[0]; // Obtener la primera hoja
  
      // Obtener todas las filas en la hoja
      const rows = await sheet.getRows();
  
      // Validar que el número de fila proporcionado esté dentro del rango del array
      if (rowNumber >= 1 && rowNumber <= rows.length) {
        const specificRow = rows[rowNumber - 1]; // Restamos 1 porque los índices en arrays comienzan desde 0
        const rowData = {};
  
        // Iterar a través de cada celda en la fila específica
        for (const [index, value] of specificRow._rawData.entries()) {
          const columnName = sheet.headerValues[index];
          rowData[columnName] = value;
        }
  
        // Devolver un objeto con los datos de la fila específica
        return rowData;
      } else {
        console.log(`El número de fila ${rowNumber} está fuera del rango.`);
        return null;
      }
    } catch (err) {
      // Registrar y manejar cualquier error que ocurra durante el proceso
      console.log("Error:", err);
      return null;
    }
  };
  
  
  
  

  getAllRowsBySheetName = async (sheetName) => {
    try {
      // Cargar la información del documento de Google Sheets
      await this.doc.loadInfo();
      
      // Buscar la hoja por nombre
      const sheet = this.doc.sheetsByTitle[sheetName];
      
      if (!sheet) {
        console.log(`No se encontró la hoja con el nombre '${sheetName}'.`);
        return null;
      }
  
      // Obtener todas las filas en la hoja
      const rows = await sheet.getRows();
  
      // Array para almacenar los datos de todas las filas
      const allRows = rows.map((row) => {
        const rowData = {};
        // Iterar a través de cada celda en la fila
        for (const [index, value] of row._rawData.entries()) {
          const columnName = sheet.headerValues[index];
          rowData[columnName] = value;
        }
        return rowData;
      });
  
      // Devolver el array con todos los datos de las filas
      return allRows;
    } catch (err) {
      // Registrar y manejar cualquier error que ocurra durante el proceso
      console.log("Error:", err);
      return null;
    }
  };
  

  saveOrders = async (dataArray = []) => {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[1]; // la segunda hoja
  
    const addedOrders = [];
  
    // Recorrer el array y agregar cada elemento como una fila
    for (const data of dataArray) {
      const order = await sheet.addRow({
        JID: data.JID,
        Nombre: data.Nombre
      });
  
      addedOrders.push(order);
    }
  
    return addedOrders;
  };
 
  
  searchAndReturnFirstRow = async (sheetName) => {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByTitle[sheetName];
      
      if (!sheet) {
        console.log(`No se encontró la hoja con el nombre '${sheetName}'.`);
        return null;
      }
  
      const rows = await sheet.getRows({ limit: 1 }); // Obtener la primera fila
  
      if (rows.length >= 1) { // Verificar si hay al menos una fila en la hoja
        const firstRow = rows[0];
        return firstRow._rawData; // Devolver los datos de la primera fila
      } else {
        return null; // Retorna null si no hay filas en la hoja
      }
    } catch (err) {
      console.log("Error:", err);
      return null;
    }
  };

  /**
   * 
   * @param {*} data
   */
  saveOrder = async (data = {}) => {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[1]; // the first sheet

    const order = await sheet.addRow({
      fecha: data.fecha,
      telefono: data.telefono,
      nombre: data.nombre,
      pedido: data.pedido,
      observaciones: data.observaciones,
    });

    return order
  };
}



export default GoogleSheetService;