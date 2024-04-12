"use client";

import React, { useCallback, useEffect, useState } from "react";

import { DateTime } from "luxon";
import "gantt-schedule-timeline-calendar/dist/style.css";

let GSTC, gstc, state;

const datosUsrs = [
  {
    _id: "66158e6958d56c54d51836e3",
    eNombre: "Alan de Jesus",
    eApeP: "Avalos",
    eApeM: "Negrete",
    eRol: "adm",
    eEdad: 19,
    eNumero: 4281108561,
    eCorreo: "avalosalan789@gmail.com",
    auSede: "N/A",
    uArea: "N/A",
    uTurno: "N/A",
    pwd: "$2a$12$VxQHGsZ7YeLEMgLl1v/xoukO65sBA0PJBwaqkd/pU6v9oOB2NwZX2",
    createdAt: "2024-04-09T18:52:25.858Z",
    updatedAt: "2024-04-12T04:45:04.995Z",
  },
  {
    _id: "6615924a58d56c54d5183740",
    eNombre: "Alan",
    eApeP: "Avalos",
    eApeM: "Negrete",
    eRol: "emp",
    eEdad: 19,
    eNumero: 1111111111,
    eCorreo: "alangamer00185@gmail.com",
    auSede: "Dolores",
    uArea: "IMMS",
    uTurno: "1d/2d",
    pwd: "$2a$12$QLFM28J.wKzC4HpxuWhXFOXv2wYQVD6Xi3H2mvLLUmtzdn8ftjt5m",
    createdAt: "2024-04-09T19:08:58.269Z",
    updatedAt: "2024-04-12T07:02:00.541Z",
  },
  {
    _id: "66159e8c58d56c54d518377c",
    eNombre: "Test",
    eApeP: "Test",
    eApeM: "Test",
    eRol: "sAdm",
    eEdad: 12,
    eNumero: 1242313141,
    eCorreo: "usuario@example.com",
    auSede: "N/A",
    uArea: "N/A",
    uTurno: "N/A",
    pwd: "$2a$12$U52viuE1pauIBvIgvcGUiuzUtMIymCV.8iwtNLJtmY9CzqOQm1QdG",
    createdAt: "2024-04-09T20:01:16.950Z",
    updatedAt: "2024-04-09T20:01:16.950Z",
  },
  {
    _id: "66159ee358d56c54d518377e",
    eNombre: "Test",
    eApeP: "Test",
    eApeM: "Test",
    eRol: "adm",
    eEdad: 23,
    eNumero: 2242424242,
    eCorreo: "usuarioadm@example.com",
    auSede: "Dolores",
    uArea: "",
    uTurno: "N/A",
    pwd: "$2a$12$sZ6SxrXsogGrfYP.Fs.1iOUL4r27pFx2ZmaD0v0WQRWTlLNAGpqSC",
    createdAt: "2024-04-09T20:02:43.172Z",
    updatedAt: "2024-04-09T20:02:43.172Z",
  },
  {
    _id: "6615fcc3a18255d9320a2484",
    eNombre: "Super Administrador",
    eApeP: "N/A",
    eApeM: "N/A",
    eRol: "sAdm",
    eEdad: 10,
    eNumero: 1000000000,
    eCorreo: "sadm@example.com",
    auSede: "N/A",
    uArea: "N/A",
    uTurno: "N/A",
    pwd: "$2a$12$kL5eEEM0i3DZEOk4azvRjeRw9RnXB9HLmM/eVx5FwrufN3IM.9FLy",
    createdAt: "2024-04-10T02:43:15.096Z",
    updatedAt: "2024-04-10T02:43:15.096Z",
  },
  {
    _id: "6615fce7a18255d9320a2486",
    eNombre: "Administrador",
    eApeP: "N/A",
    eApeM: "N/A",
    eRol: "adm",
    eEdad: 11,
    eNumero: 1111111111,
    eCorreo: "adm@example.com",
    auSede: "Dolores",
    uArea: "",
    uTurno: "N/A",
    pwd: "$2a$12$99f979JRJChabXl4AC6XoOtHGKib26nxJ2fFM2EaD83wrliQKwcVi",
    createdAt: "2024-04-10T02:43:51.017Z",
    updatedAt: "2024-04-10T02:43:51.017Z",
  },
  {
    _id: "6615fcfea18255d9320a2488",
    eNombre: "Karime Alejandra",
    eApeP: "Cabellero",
    eApeM: "Campos",
    eRol: "emp",
    eEdad: 11,
    eNumero: 1111111111,
    eCorreo: "karimec686@gmail.com",
    auSede: "Dolores",
    uArea: "IMMS",
    uTurno: "5d/2d7:00 / 15:00",
    pwd: "$2a$12$1dZEIXZlMfGkuzjmyBj3SO1eviMPANYHkkkBkMNUuv403FVCIuuhe",
    createdAt: "2024-04-10T02:44:14.078Z",
    updatedAt: "2024-04-10T20:20:02.026Z",
  },
  {
    _id: "661888ac40b9804f3d6d0893",
    eNombre: "Test 0001",
    eApeP: "pruebas",
    eApeM: "pruebas",
    eRol: "adm",
    eEdad: 19,
    eNumero: 1939813881,
    eCorreo: "a@a2.a",
    auSede: "GDS0551",
    uArea: "",
    uTurno: "N/A",
    pwd: "$2a$12$/VU5uWYSHscApI/9RgVFOO64NBf6OlPFiCCb/oo3zfeBAF.waCfim",
    createdAt: "2024-04-12T01:04:44.497Z",
    updatedAt: "2024-04-12T01:04:44.497Z",
  },
  {
    _id: "6618d811fcfd852f3ac05af2",
    eNombre: "ALAN",
    eApeP: "A",
    eApeM: "A",
    eRol: "adm",
    eEdad: 11,
    eNumero: 1111111111,
    eCorreo: "a@a.2",
    auSede: "GDS0551",
    uArea: "",
    uTurno: "1d/2d",
    pwd: "$2a$12$9Hr4/UuoeLxzO0jHYJlLnuV/gPMkJhR7VWrUd0xyorQJII5b2q1dq",
    createdAt: "2024-04-12T06:43:29.937Z",
    updatedAt: "2024-04-12T06:48:09.921Z",
  },
  {
    _id: "6618dc9caa787d6a47b5891a",
    eNombre: "Test 55",
    eApeP: "5",
    eApeM: "5",
    eRol: "adm",
    eEdad: 55,
    eNumero: 5555555555,
    eCorreo: "5@t5",
    auSede: "GDS0551",
    uArea: "",
    uTurno: "6d/1d",
    pwd: "$2a$12$x80.54Vu3yA9W7jXDX/.yOKyYS.0iXi7o.rY/.rJw4I6VHzmfR5VW",
    createdAt: "2024-04-12T07:02:52.925Z",
    updatedAt: "2024-04-12T07:04:11.236Z",
  },
];
const datosActivity = [
  {
    _id: "6618db9f820943079076a459",
    fechaI: "2024-05-01T00:00:00.000Z",
    fechaF: "2024-05-02T00:00:00.000Z",
    motivo: "Malasia 2",
    Administradores: [],
    Empleados: [],
    estado: "Aprovada",
    eCorreo: "alangamer00185@gmail.com",
    tipo: "vacacion",
    createdAt: "2024-04-12T06:58:39.301Z",
    updatedAt: "2024-04-12T06:58:39.301Z",
    __v: 0,
  },

  {
    _id: "6618dc00820943079076a461",
    nombre: "Pruebas",
    fechaI: "2024-04-25T00:00:00.000Z",
    fechaF: "2024-04-29T00:00:00.000Z",
    motivo: "Se deben de realizar las pruebas necesarias",
    Administradores: ["Alan de Jesus Avalos"],
    Empleados: ["Alan Avalos"],
    eCorreo: "avalosalan789@gmail.com",
    tipo: "training",
    createdAt: "2024-04-12T07:00:16.529Z",
    updatedAt: "2024-04-12T07:00:16.529Z",
    __v: 0,
  },
  {
    _id: "6618dc00820943079076a461",
    nombre: "Pruebas",
    fechaI: "2024-04-25T00:00:00.000Z",
    fechaF: "2024-04-29T00:00:00.000Z",
    motivo: "Se deben de realizar las pruebas necesarias",
    Administradores: ["Alan de Jesus Avalos"],
    Empleados: ["Alan Avalos"],
    eCorreo: "alangamer00185@gmail.com",
    tipo: "training",
    createdAt: "2024-04-12T07:00:16.529Z",
    updatedAt: "2024-04-12T07:00:16.529Z",
    __v: 0,
  },
  {
    _id: "6618dcd3aa787d6a47b58926",
    fechaI: "2024-04-09T00:00:00.000Z",
    fechaF: "2024-04-24T00:00:00.000Z",
    motivo: "aaa",
    Administradores: [],
    Empleados: [],
    estado: "Aprovada",
    eCorreo: "5@t5",
    tipo: "vacacion",
    createdAt: "2024-04-12T07:03:47.127Z",
    updatedAt: "2024-04-12T07:03:47.127Z",
    __v: 0,
  },
  {
    _id: "6618dcbdaa787d6a47b58921",
    motivo: "asssa",
    Administradores: [],
    Empleados: [],
    estado: "Aprovada",
    eCorreo: "5@t5",
    tipo: "turno",
    turno: "6d/1d",
    createdAt: "2024-04-12T07:03:25.624Z",
    updatedAt: "2024-04-12T07:03:25.624Z",
    __v: 0,
  },
  {
    _id: "6618db7668f0f11313d48f6837c8",
    motivo: "Lo ocupo porfa",
    Administradores: [],
    Empleados: [],
    estado: "Aprovada",
    eCorreo: "a@a2.a",
    tipo: "turno",
    turno: "6d/2d",
    createdAt: "2024-04-12T06:57:58.228Z",
    updatedAt: "2024-04-12T06:57:58.228Z",
    __v: 0,
  },
  {
    _id: "6618db7668f0f1d48f6837c8",
    motivo: "Lo ocupo porfa",
    Administradores: [],
    Empleados: [],
    estado: "Aprovada",
    eCorreo: "alangamer00185@gmail.com",
    tipo: "turno",
    turno: "6d/1d",
    createdAt: "2024-04-12T06:57:58.228Z",
    updatedAt: "2024-04-12T06:57:58.228Z",
    __v: 0,
  },
];

async function initializeGSTC(element) {
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

  // Funcion que genera un arreglo de objetos que con las fechas de inicio y fin dependiendo el turno
  // Se el ingresan el correo para relacionarla con las filas
  function generarObjetos(eCorreo, turno) {
    if (!turno) {
      console.error("La propiedad 'turno' no está definida correctamente.");
      return [];
    }

    const fechaActual = DateTime.local();
    const [diasTrabajo, diasDescanso] = turno
      .split("/")
      .map((item) => parseInt(item));

    const objetosTrabajo = [];
    const objetosDescanso = [];

    let fechaInicio = fechaActual.startOf("month");

    while (fechaInicio < fechaActual.endOf("month")) {
      const fechaInicioTrabajo = fechaInicio.startOf("day");
      const fechaFinTrabajo = fechaInicio
        .plus({ days: diasTrabajo - 1 })
        .endOf("day");

      objetosTrabajo.push({
        motivo: "Días de trabajo",
        eCorreo,
        tipo: "trabajo",
        fechaInicio: fechaInicioTrabajo.toISO(),
        fechaFin: fechaFinTrabajo.toISO(),
      });

      fechaInicio = fechaFinTrabajo.plus({ days: diasDescanso }).startOf("day");
      const fechaFinDescanso = fechaInicio
        .plus({ days: diasDescanso - 1 })
        .endOf("day");

      objetosDescanso.push({
        motivo: "Días de descanso",
        eCorreo,
        tipo: "descanso",
        fechaInicio: fechaInicio.toISO(),
        fechaFin: fechaFinDescanso.toISO(),
      });

      fechaInicio = fechaFinDescanso.plus({ days: 1 }).startOf("day");
    }

    return [...objetosTrabajo, ...objetosDescanso];
  }

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
    const items = {};

    // Itera en todos los objetos del arreglo que recibe de la base de datos
    datosActivity.forEach((data, i) => {
      // Si el tipo de ese objeti es "turno", generar los objetos utilizando la función generarObjetos
      if (data.tipo === "turno") {
        const turnos = generarObjetos(data.eCorreo, data.turno);

        // Aqui itera en los turnos que devuelve la funcion para agregarlo como items
        turnos.forEach((turno, index) => {
          const id = GSTC.api.GSTCID((i + index).toString());
          const rowId = GSTC.api.GSTCID(turno.eCorreo);

          items[id] = {
            id,
            label: turno.motivo,
            rowId,
            time: {
              start: new Date(turno.fechaInicio).getTime(),
              end: new Date(turno.fechaFin).getTime(),
            },
            style: {
              backgroundColor: turno.tipo === "trabajo" ? "green" : "orange",
            },
          };
        });
      } else {
        // Si el tipo no es "turno", crear el ítem directamente
        let startDate = new Date(data.fechaI);
        let endDate = new Date(data.fechaF);

        let luxonStartDate = DateTime.fromJSDate(startDate);
        let luxonEndDate = DateTime.fromJSDate(endDate);

        const id = GSTC.api.GSTCID(i.toString());
        const rowId = GSTC.api.GSTCID(data.eCorreo);

        items[id] = {
          id,
          label: `${data.tipo} : ${data.motivo}`,
          rowId,
          time: {
            start: luxonStartDate.valueOf(),
            end: luxonEndDate.valueOf(),
          },
          style: {
            backgroundColor: data.tipo === "vacacion" ? "blue" : "red",
          },
        };
      }
    });
    console.log(items);
    return items;
  }

  /**
   * Configuración de gantt-schedule-timeline-calendar
   * @type { import("gantt-schedule-timeline-calendar").Config }
   */

  const config = {
    // Licencia generada, esta debe especificar la url dond ese va especificar cuando se usa (PORT=3001)
    licenseKey:
      "====BEGIN LICENSE KEY====\ncZ55O7rPbNDOyVUVvAERSUz3DOG6de5guknU4A2MdRES8fWIO/l+3CeLAVwTWhpqfrD4hi6uMd70ONgxxw5QpSijDMyet42cUgxtnbp4GaW9YwrAlPuoGILT93DzUs3bWumBL9Y1OlXiEVSgKBmAPWSPuNBBjz0bBBeYf2Cv2b+5bXMNr7fqQfybtubff2d4n1eyQxiDlIJkcj/fn492IkjJsBLi0EWHBgzD1KzjHKTS1WhvJ0Q/97PVFGi2HfvyYhqMpwoHRCZz1/UCeS7PZC5PgsV6YXUV7T2ronedpG/LMuXRFEoaBeVm5k4nCt18O0PGtZQxZLp0MmwOQZtJ+g==||U2FsdGVkX18GEtHZRyEr9mFMAbgWWOoYcOvzzquaHgguU58/DprZPdkOmI8y7TvZ5Qp6zAWm7NERhQ06GWxzSfQVxckupwyKKxQVzKyPmJc=\nKd01Nr88reSrXyJlsQ/OI8dKMlUJDXoc/9ti5pdx4WCNyyXCWBlWmTzbgOMyZ1YIK9QR1SC0R003HWlikG1f+x91ElgeZpJwJ5wNCMfvGsDf3MQTDEygPlKIAvM4RdIBzkGof2aek4EVIKEaqbu/L38AZyQSkv2QOVcvka1NhabiQGkillyRf33VgKSr8Z7Zfuvj7+VK2XduksL4mIsUqPXraIdTxLZp3IzIC9Cqs6axn/axtHjhw9vg0fGlYrD1aDMxJGg7ZDee7UVgFVybIYQWVg9VygXehudrzdsaDC+U3fJ0br8shYoSpdFqgFTRPBgv7F/i48tzxsbRkRrzjQ==\n====END LICENSE KEY====",
    plugins: [
      TimelinePointer(),
      //Selection(),
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
export default function GanttPage() {
  // Aqui se obtienen los datos de al api

  // const [datosUsrs, setDatosUsrs] = useState([]);
  // const [datosActivity, setatosActivity] = useState([]);

  // // Traer datos de usuario
  // useEffect(() => {
  //   const loadDataUsers = async () => {
  //     try {
  //       const usersResponse = await fetch("/api/usrs");

  //       if (!usersResponse.ok) {
  //         throw new Error("Error al obtener los datos");
  //       }

  //       const usersData = await usersResponse.json();

  //       setDatosUsrs(usersData);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   loadDataUsers();
  // }, []);

  // // Traer datos de las actividades
  // useEffect(() => {
  //   const loadDataActivity = async () => {
  //     try {
  //       const activityResponse = await fetch("/api/actividades");

  //       if (!activityResponse.ok) {
  //         throw new Error("Error al obtener los datos");
  //       }

  //       const activityData = await activityResponse.json();

  //       setatosActivity(activityData);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   loadDataActivity();
  // }, []);

  // Funcion para inicializar la libreria

  const callback = useCallback((element) => {
    if (element) initializeGSTC(element);
  }, []);

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
      {/* <button onClick={updateFirstRow}>Change row 1 label</button> */}
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
