"use client";

import React, { useCallback, useEffect, useState } from "react";

import { DateTime } from "luxon";
import "gantt-schedule-timeline-calendar/dist/style.css";

let GSTC, gstc, state;

async function initializeGSTC(element, datosUsrs, datosActivity) {
  GSTC = (await import("gantt-schedule-timeline-calendar")).default;

  // Plugin de linea del timepo
  const TimelinePointer = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js"
    )
  ).Plugin;

  // Plugin para poder seleccionar los items
  const Selection = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js"
    )
  ).Plugin;

  // Plugin para mover los items
  const ItemMovement = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js"
    )
  ).Plugin;

  // Congifuguracion para mover los items de arriba a abajo (a los lados no se puede)
  const itemMovementOptions = {
    events: {
      onMove({ items }) {
        // items before the current movement
        return items.before.map((beforeMovementItem, index) => {
          // item data after move
          const afterMovementItem = items.after[index];

          // clone item to prevent bugs
          const myItem = GSTC.api.merge({}, afterMovementItem);

          // Solo permite el movimiento vertical
          myItem.time.start = beforeMovementItem.time.start;
          myItem.time.end = beforeMovementItem.time.end;
          return myItem;
        });
      },
    },
  };

  // Función para generar los items
  function generateRows() {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Rows }
     */
    const rows = {};

    datosUsrs.forEach((data) => {
      const id = GSTC.api.GSTCID(data.eCorreo); // Usamos eCorreo como identificador de la fila
      rows[id] = {
        id,
        label: `${data.eNombre} ${data.eApeP} ${data.eApeM}`, // Cambiar a la propiedad deseada para la etiqueta de la fila
      };
    });

    return rows;
  }

  // Funcion para generar los items utilizando datos de la base de datos
  function generateItems() {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Items }
     */
    const items = {};
    // @ts-ignore

    datosActivity.forEach((data, i) => {
      // Convertir las fechas de MongoDB en objetos de fecha de JavaScript
      let startDate = new Date(data.fechaI);
      let endDate = new Date(data.fechaF);

      // Convertir las fechas de JavaScript en objetos de fecha de Luxon
      let luxonStartDate = DateTime.fromJSDate(startDate);
      let luxonEndDate = DateTime.fromJSDate(endDate);

      const id = GSTC.api.GSTCID(i.toString());
      const rowId = GSTC.api.GSTCID(data.eCorreo);

      items[id] = {
        id,
        label: data.motivo,
        rowId,
        time: {
          start: luxonStartDate.valueOf(),
          end: luxonEndDate.valueOf(),
        },
      };
    });

    return items;
  }

  /**
   * Configuración de gantt-schedule-timeline-calendar
   * @type { import("gantt-schedule-timeline-calendar").Config }
   */

  const config = {
    // Licencia generada, esta debe especificar la url dond ese va especificar cuando se usa (PORT=3001)
    licenseKey:
      // esta es la que funciona bien en 3000 y host
      //"====BEGIN LICENSE KEY====\ncZ55O7rPbNDOyVUVvAERSUz3DOG6de5guknU4A2MdRES8fWIO/l+3CeLAVwTWhpqfrD4hi6uMd70ONgxxw5QpSijDMyet42cUgxtnbp4GaW9YwrAlPuoGILT93DzUs3bWumBL9Y1OlXiEVSgKBmAPWSPuNBBjz0bBBeYf2Cv2b+5bXMNr7fqQfybtubff2d4n1eyQxiDlIJkcj/fn492IkjJsBLi0EWHBgzD1KzjHKTS1WhvJ0Q/97PVFGi2HfvyYhqMpwoHRCZz1/UCeS7PZC5PgsV6YXUV7T2ronedpG/LMuXRFEoaBeVm5k4nCt18O0PGtZQxZLp0MmwOQZtJ+g==||U2FsdGVkX18GEtHZRyEr9mFMAbgWWOoYcOvzzquaHgguU58/DprZPdkOmI8y7TvZ5Qp6zAWm7NERhQ06GWxzSfQVxckupwyKKxQVzKyPmJc=\nKd01Nr88reSrXyJlsQ/OI8dKMlUJDXoc/9ti5pdx4WCNyyXCWBlWmTzbgOMyZ1YIK9QR1SC0R003HWlikG1f+x91ElgeZpJwJ5wNCMfvGsDf3MQTDEygPlKIAvM4RdIBzkGof2aek4EVIKEaqbu/L38AZyQSkv2QOVcvka1NhabiQGkillyRf33VgKSr8Z7Zfuvj7+VK2XduksL4mIsUqPXraIdTxLZp3IzIC9Cqs6axn/axtHjhw9vg0fGlYrD1aDMxJGg7ZDee7UVgFVybIYQWVg9VygXehudrzdsaDC+U3fJ0br8shYoSpdFqgFTRPBgv7F/i48tzxsbRkRrzjQ==\n====END LICENSE KEY===="
      // esta funciona bien en 3001
      "====BEGIN LICENSE KEY====\ncZ55O7rPbNDOyVUVvAERSUz3DOG6de5guknU4A2MdRES8fWIO/l+3CeLAVwTWhpqfrD4hi6uMd70ONgxxw5QpSijDMyet42cUgxtnbp4GaW9YwrAlPuoGILT93DzUs3bWumBL9Y1OlXiEVSgKBmAPWSPuNBBjz0bBBeYf2Cv2b+5bXMNr7fqQfybtubff2d4n1eyQxiDlIJkcj/fn492IkjJsBLi0EWHBgzD1KzjHKTS1WhvJ0Q/97PVFGi2HfvyYhqMpwoHRCZz1/UCeS7PZC5PgsV6YXUV7T2ronedpG/LMuXRFEoaBeVm5k4nCt18O0PGtZQxZLp0MmwOQZtJ+g==||U2FsdGVkX18GEtHZRyEr9mFMAbgWWOoYcOvzzquaHgguU58/DprZPdkOmI8y7TvZ5Qp6zAWm7NERhQ06GWxzSfQVxckupwyKKxQVzKyPmJc=\nKd01Nr88reSrXyJlsQ/OI8dKMlUJDXoc/9ti5pdx4WCNyyXCWBlWmTzbgOMyZ1YIK9QR1SC0R003HWlikG1f+x91ElgeZpJwJ5wNCMfvGsDf3MQTDEygPlKIAvM4RdIBzkGof2aek4EVIKEaqbu/L38AZyQSkv2QOVcvka1NhabiQGkillyRf33VgKSr8Z7Zfuvj7+VK2XduksL4mIsUqPXraIdTxLZp3IzIC9Cqs6axn/axtHjhw9vg0fGlYrD1aDMxJGg7ZDee7UVgFVybIYQWVg9VygXehudrzdsaDC+U3fJ0br8shYoSpdFqgFTRPBgv7F/i48tzxsbRkRrzjQ==\n====END LICENSE KEY====",
    // Plugins a utilizar ya importandos anteriormente
    plugins: [
      TimelinePointer(),
      Selection(),
      //ItemMovement(itemMovementOptions), // Se agrega la configuracion creada
    ],
    list: {
      columns: {
        data: {
          // Columnas de la tabla lateral
          [GSTC.api.GSTCID("id")]: {
            id: GSTC.api.GSTCID("id"),
            width: 200,
            data: ({ row }) => GSTC.api.sourceID(row.id),
            header: {
              content: "Correo",
            },
          },
          [GSTC.api.GSTCID("label")]: {
            id: GSTC.api.GSTCID("label"),
            width: 200,
            data: "label",
            header: {
              content: "Nombre",
            },
          },
        },
      },
      // Filas a utilizar
      rows: generateRows(),
    },
    chart: {
      // Items generados
      items: generateItems(),
    },
  };

  state = GSTC.api.stateFromConfig(config);

  gstc = GSTC({
    element,
    state,
  });
}
// Aqui se deben de cargar los datos de la api de usrs yt actividades
//   {
//     _id: "66158e6958d56c54d51836e3",
//     eNombre: "Alan de Jesus",
//     eApeP: "Avalos",
//     eApeM: "Negrete",
//     eRol: "adm",
//     eEdad: 19,
//     eNumero: 4281108561,
//     eCorreo: "avalosalan789@gmail.com",
//     auSede: "N/A",
//     uArea: "N/A",
//     uTurno: "N/A",
//     pwd: "$2a$12$papFX3Omlaf0u5UdU9B5uu13ifZp03q2d1Io6hdPuCn9GGql1CP2y",
//     createdAt: "2024-04-09T18:52:25.858Z",
//     updatedAt: "2024-04-09T18:52:25.858Z",
//   },
//   {
//     _id: "6615924a58d56c54d5183740",
//     eNombre: "Alan",
//     eApeP: "Avalos",
//     eApeM: "Negrete",
//     eRol: "emp",
//     eEdad: 19,
//     eNumero: 1111111111,
//     eCorreo: "alangamer00185@gmail.com",
//     auSede: "Dolores",
//     uArea: "IMMS",
//     uTurno: "5d/2d7:00 / 15:00",
//     pwd: "$2a$12$dJJ3Xbs3shk73BxTiclfXOxnQuJPjEH5ajyoza/YBODOkqOLUNywq",
//     createdAt: "2024-04-09T19:08:58.269Z",
//     updatedAt: "2024-04-11T14:39:06.455Z",
//   },
//   {
//     _id: "66159e8c58d56c54d518377c",
//     eNombre: "Test",
//     eApeP: "Test",
//     eApeM: "Test",
//     eRol: "sAdm",
//     eEdad: 12,
//     eNumero: 1242313141,
//     eCorreo: "usuario@example.com",
//     auSede: "N/A",
//     uArea: "N/A",
//     uTurno: "N/A",
//     pwd: "$2a$12$U52viuE1pauIBvIgvcGUiuzUtMIymCV.8iwtNLJtmY9CzqOQm1QdG",
//     createdAt: "2024-04-09T20:01:16.950Z",
//     updatedAt: "2024-04-09T20:01:16.950Z",
//   },
//   {
//     _id: "66159ee358d56c54d518377e",
//     eNombre: "Test",
//     eApeP: "Test",
//     eApeM: "Test",
//     eRol: "adm",
//     eEdad: 23,
//     eNumero: 2242424242,
//     eCorreo: "usuarioadm@example.com",
//     auSede: "Dolores",
//     uArea: "",
//     uTurno: "N/A",
//     pwd: "$2a$12$sZ6SxrXsogGrfYP.Fs.1iOUL4r27pFx2ZmaD0v0WQRWTlLNAGpqSC",
//     createdAt: "2024-04-09T20:02:43.172Z",
//     updatedAt: "2024-04-09T20:02:43.172Z",
//   },
//   {
//     _id: "6615fcc3a18255d9320a2484",
//     eNombre: "Super Administrador",
//     eApeP: "N/A",
//     eApeM: "N/A",
//     eRol: "sAdm",
//     eEdad: 10,
//     eNumero: 1000000000,
//     eCorreo: "sadm@example.com",
//     auSede: "N/A",
//     uArea: "N/A",
//     uTurno: "N/A",
//     pwd: "$2a$12$kL5eEEM0i3DZEOk4azvRjeRw9RnXB9HLmM/eVx5FwrufN3IM.9FLy",
//     createdAt: "2024-04-10T02:43:15.096Z",
//     updatedAt: "2024-04-10T02:43:15.096Z",
//   },
//   {
//     _id: "6615fce7a18255d9320a2486",
//     eNombre: "Administrador",
//     eApeP: "N/A",
//     eApeM: "N/A",
//     eRol: "adm",
//     eEdad: 11,
//     eNumero: 1111111111,
//     eCorreo: "adm@example.com",
//     auSede: "Dolores",
//     uArea: "",
//     uTurno: "N/A",
//     pwd: "$2a$12$99f979JRJChabXl4AC6XoOtHGKib26nxJ2fFM2EaD83wrliQKwcVi",
//     createdAt: "2024-04-10T02:43:51.017Z",
//     updatedAt: "2024-04-10T02:43:51.017Z",
//   },
//   {
//     _id: "6615fcfea18255d9320a2488",
//     eNombre: "Karime Alejandra",
//     eApeP: "Cabellero",
//     eApeM: "Campos",
//     eRol: "emp",
//     eEdad: 11,
//     eNumero: 1111111111,
//     eCorreo: "karimec686@gmail.com",
//     auSede: "Dolores",
//     uArea: "IMMS",
//     uTurno: "5d/2d7:00 / 15:00",
//     pwd: "$2a$12$1dZEIXZlMfGkuzjmyBj3SO1eviMPANYHkkkBkMNUuv403FVCIuuhe",
//     createdAt: "2024-04-10T02:44:14.078Z",
//     updatedAt: "2024-04-10T20:20:02.026Z",
//   },
// ];

// const datosActivity = [
//   {
//     _id: "661590ad58d56c54d5183717",
//     fechaI: "2024-04-10T00:00:00.000Z",
//     fechaF: "2024-04-13T00:00:00.000Z",
//     motivo: "Pruebas de funcionamiento 1",
//     Administradores: [],
//     Empleados: [],
//     estado: "Aprovada",
//     eCorreo: "avalosalan789@gmail.com",
//     tipo: "vacacion",
//     createdAt: "2024-04-09T19:02:05.965Z",
//     updatedAt: "2024-04-09T19:02:05.965Z",
//     __v: 0,
//   },
//   {
//     _id: "6615929f58d56c54d518374f",
//     nombre: "Test Training",
//     fechaI: "2024-04-08T00:00:00.000Z",
//     fechaF: "2024-04-23T00:00:00.000Z",
//     motivo: "Pruebas",
//     Administradores: ["Alan de Jesus Avalos"],
//     Empleados: ["Alan Avalos"],
//     eCorreo: "avalosalan789@gmail.com",
//     tipo: "training",
//     createdAt: "2024-04-09T19:10:23.233Z",
//     updatedAt: "2024-04-09T19:10:23.233Z",
//     __v: 0,
//   },
//   {
//     _id: "6615929f58d56c54d518374f",
//     nombre: "Test Training",
//     fechaI: "2024-04-08T00:00:00.000Z",
//     fechaF: "2024-04-23T00:00:00.000Z",
//     motivo: "Pruebas",
//     Administradores: ["Alan de Jesus Avalos"],
//     Empleados: ["Alan Avalos"],
//     eCorreo: "alangamer00185@gmail.com",
//     tipo: "training",
//     createdAt: "2024-04-09T19:10:23.233Z",
//     updatedAt: "2024-04-09T19:10:23.233Z",
//     __v: 0,
//   },
//   {
//     _id: "661598c5155e7594117d2559",
//     fechaI: "2024-04-24T00:00:00.000Z",
//     fechaF: "2024-04-19T00:00:00.000Z",
//     motivo: "Test desde el deploy",
//     Administradores: [],
//     Empleados: [],
//     estado: "Aprovada",
//     eCorreo: "alangamer00185@gmail.com",
//     tipo: "vacacion",
//     createdAt: "2024-04-09T19:36:37.255Z",
//     updatedAt: "2024-04-09T19:36:37.255Z",
//     __v: 0,
//   },
//   {
//     _id: "6615e9ca6a3ea6fb279b4522",
//     fechaI: "2024-04-10T00:00:00.000Z",
//     fechaF: "2024-04-26T00:00:00.000Z",
//     motivo: "Hola",
//     Administradores: [],
//     Empleados: [],
//     estado: "Aprovada",
//     eCorreo: "alangamer00185@gmail.com",
//     tipo: "vacacion",
//     createdAt: "2024-04-10T01:22:18.707Z",
//     updatedAt: "2024-04-10T01:22:18.707Z",
//     __v: 0,
//   },
//   {
//     _id: "6615f9348eb41acf28e9fd2e",
//     fechaI: "2024-04-17T00:00:00.000Z",
//     fechaF: "2024-04-18T00:00:00.000Z",
//     motivo: "12",
//     Administradores: [],
//     Empleados: [],
//     estado: "Aprovada",
//     eCorreo: "avalosalan789@gmail.com",
//     tipo: "vacacion",
//     createdAt: "2024-04-10T02:28:04.224Z",
//     updatedAt: "2024-04-10T02:28:04.224Z",
//     __v: 0,
//   },
//   {
//     _id: "66160810dd584f462a44c8e9",
//     nombre: "Entrenamiento de Seguridad",
//     fechaI: "2024-04-15T00:00:00.000Z",
//     fechaF: "2024-04-17T00:00:00.000Z",
//     motivo: "Capacitación en seguridad laboral",
//     Administradores: ["Alan de Jesus Avalos", "Test Test", "Administrador N/A"],
//     Empleados: ["Alan Avalos", "Karime Alejandra Cabellero"],
//     eCorreo: "avalosalan789@gmail.com",
//     tipo: "training",
//     createdAt: "2024-04-10T03:31:28.716Z",
//     updatedAt: "2024-04-10T03:31:28.716Z",
//     __v: 0,
//   },
//   {
//     _id: "66160810dd584f462a44c8e9",
//     nombre: "Entrenamiento de Seguridad",
//     fechaI: "2024-04-15T00:00:00.000Z",
//     fechaF: "2024-04-17T00:00:00.000Z",
//     motivo: "Capacitación en seguridad laboral",
//     Administradores: ["Alan de Jesus Avalos", "Test Test", "Administrador N/A"],
//     Empleados: ["Alan Avalos", "Karime Alejandra Cabellero"],
//     eCorreo: "alangamer00185@gmail.com",
//     tipo: "training",
//     createdAt: "2024-04-10T03:31:28.716Z",
//     updatedAt: "2024-04-10T03:31:28.716Z",
//     __v: 0,
//   },
//   {
//     _id: "66160810dd584f462a44c8e9",
//     nombre: "Entrenamiento de Seguridad",
//     fechaI: "2024-04-15T00:00:00.000Z",
//     fechaF: "2024-04-17T00:00:00.000Z",
//     motivo: "Capacitación en seguridad laboral",
//     Administradores: ["Alan de Jesus Avalos", "Test Test", "Administrador N/A"],
//     Empleados: ["Alan Avalos", "Karime Alejandra Cabellero"],
//     eCorreo: "usuario@example.com",
//     tipo: "training",
//     createdAt: "2024-04-10T03:31:28.716Z",
//     updatedAt: "2024-04-10T03:31:28.716Z",
//     __v: 0,
//   },
//   {
//     _id: "66160810dd584f462a44c8e9",
//     nombre: "Entrenamiento de Seguridad",
//     fechaI: "2024-04-15T00:00:00.000Z",
//     fechaF: "2024-04-17T00:00:00.000Z",
//     motivo: "Capacitación en seguridad laboral",
//     Administradores: ["Alan de Jesus Avalos", "Test Test", "Administrador N/A"],
//     Empleados: ["Alan Avalos", "Karime Alejandra Cabellero"],
//     eCorreo: "usuarioadm@example.com",
//     tipo: "training",
//     createdAt: "2024-04-10T03:31:28.716Z",
//     updatedAt: "2024-04-10T03:31:28.716Z",
//     __v: 0,
//   },
//   {
//     _id: "66160810dd584f462a44c8e9",
//     nombre: "Entrenamiento de Seguridad",
//     fechaI: "2024-04-15T00:00:00.000Z",
//     fechaF: "2024-04-17T00:00:00.000Z",
//     motivo: "Capacitación en seguridad laboral",
//     Administradores: ["Alan de Jesus Avalos", "Test Test", "Administrador N/A"],
//     Empleados: ["Alan Avalos", "Karime Alejandra Cabellero"],
//     eCorreo: "adm@example.com",
//     tipo: "training",
//     createdAt: "2024-04-10T03:31:28.716Z",
//     updatedAt: "2024-04-10T03:31:28.716Z",
//     __v: 0,
//   },
//   {
//     _id: "66160810dd584f462a44c8e9",
//     nombre: "Entrenamiento de Seguridad",
//     fechaI: "2024-04-15T00:00:00.000Z",
//     fechaF: "2024-04-17T00:00:00.000Z",
//     motivo: "Capacitación en seguridad laboral",
//     Administradores: ["Alan de Jesus Avalos", "Test Test", "Administrador N/A"],
//     Empleados: ["Alan Avalos", "Karime Alejandra Cabellero"],
//     eCorreo: "karimec686@gmail.com",
//     tipo: "training",
//     createdAt: "2024-04-10T03:31:28.716Z",
//     updatedAt: "2024-04-10T03:31:28.716Z",
//     __v: 0,
//   },
// ];

export default function Home() {
  const [datosUsrs1, setDatosUsrs] = useState([]);
  const [datosActivity1, setDatosActivity] = useState([]);

  // Traer datos de usuario
  useEffect(() => {
    const loadDataUsers = async () => {
      try {
        const usersResponse = await fetch("/api/usrs");

        if (!usersResponse.ok) {
          throw new Error("Error al obtener los datos");
        }

        const usersData = await usersResponse.json();

        setDatosUsrs(usersData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadDataUsers();
  }, []);

  // Traer datos de las actividades
  useEffect(() => {
    const loadDataActivity = async () => {
      try {
        const activityResponse = await fetch("/api/actividades");

        if (!activityResponse.ok) {
          throw new Error("Error al obtener los datos");
        }

        const activityData = await activityResponse.json();

        setDatosActivity(activityData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadDataActivity();
  }, []);

  //Funcion para inicializar la libreria

  const callback = (element) => {
    if (element) initializeGSTC(element, datosUsrs1, datosActivity1);
  };

  useEffect(() => {
    return () => {
      if (gstc) {
        gstc.destroy();
      }
    };
  });

  function updateFirstRow() {
    if (!GSTC || !state) return;
    state.update(`config.list.rows.${GSTC.api.GSTCID("0")}`, (row) => {
      row.label = "Changed dynamically";
      return row;
    });
  }

  return (
    <div className="container">
      <button onClick={updateFirstRow}>Change row 1 label</button>
      <hr />
      <div id="gstc" ref={callback}></div>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
