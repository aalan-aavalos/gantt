"use client";

import React, { useCallback, useEffect, useState } from "react";

import { DateTime } from "luxon";
import "gantt-schedule-timeline-calendar/dist/style.css";

let GSTC, gstc, state;

// const datos = [
//   {
//     _id: "660f68de4063a651e3dd3382",
//     eNombre: "Alan Gamer",
//     eApeP: "Avalos",
//     eApeM: "Negrete",
//     eRol: "emp",
//     eEdad: 19,
//     eNumero: 1210301391,
//     eCorreo: "alangamer00185@gmail.com",
//     auSede: "GOB GTO",
//     uArea: "IMMS",
//     uTurno: "5d/2d15:00 / 23:00",
//     pwd: "$2a$12$T5LxJxDW.uswDUwh188tFOgcAgl8B43S/MZz.bbQAOLYtruClpAlC",
//     createdAt: "2024-04-05T02:58:38.140Z",
//     updatedAt: "2024-04-07T14:19:37.054Z",
//   },
//   {
//     _id: "660f69674063a651e3dd339d",
//     eNombre: "Alan de Jesus",
//     eApeP: "Avalos",
//     eApeM: "Negrete",
//     eRol: "adm",
//     eEdad: 19,
//     eNumero: 4281108561,
//     eCorreo: "avalosalan789@gmail.com",
//     auSede: "GOB GTO",
//     uArea: "",
//     uTurno: "N/A",
//     pwd: "$2a$12$wT97dBV4h8vuix/EqDNR7.mL9dJEZSqN3Kn15Kckwa8aOG6I4WvxK",
//     createdAt: "2024-04-05T03:00:55.178Z",
//     updatedAt: "2024-04-05T03:00:55.178Z",
//   },
// ];

export default function Home() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const respuesta = await fetch("/api/usrs");
        if (!respuesta.ok) {
          throw new Error("Error al obtener los datos");
        }
        const datosJson = await respuesta.json();
        setDatos(datosJson);
        console.log(datos)
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadUsers();
  }, []);

  // Funcion para inicializar la libreria
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

    // Funcion para generar las filas
    // function generateRows() {
    //   /**
    //    * @type { import("gantt-schedule-timeline-calendar").Rows }
    //    */
    //   const rows = {};
    //   // Recorremos los datos de tu base de datos
    //   datos.forEach((data) => {
    //     const id = GSTC.api.GSTCID(data.eCorreo); // Utilizamos el _id como identificador de la fila
    //     rows[id] = {
    //       id,
    //       label: data.eNombre, // Utilizamos el correo como label de la fila
    //       // Puedes agregar más propiedades aquí según tus necesidades
    //     };
    //   });
    //   return rows;
    // }

    // Función para generar los items
    function generateRows() {
      /**
       * @type { import("gantt-schedule-timeline-calendar").Rows }
       */
      const rows = {};

      datos.forEach((data) => {
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

      datos.forEach((data, i) => {
        let start = DateTime.fromISO(data.createdAt);
        let end = DateTime.fromISO(data.updatedAt);
        const id = GSTC.api.GSTCID(i.toString());
        const rowId = GSTC.api.GSTCID(data.eCorreo); // Usamos eCorreo como identificador de la fila
        //start = start.add(1, "day");
        items[id] = {
          id,
          label: `Item ${i}`,
          rowId,
          time: {
            start: start.valueOf(),
            end: end.valueOf(),
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
        "====BEGIN LICENSE KEY====\nn8dujOwD1BFeGNF4bMJsr+PykNPg1NJefLJ+xcj8sIEXuqYZG/V0XxbW0ynJThxD3REi3EATh/OD/lna5QHL77uAWPlBwnyM4yIw5WXnXtlORhAptvs48leGgG3LInHS6lLQ2VDQZGTJHPjM7ztSZYfFS+T3wThlofWmVlFvVDkhIXmfF4TYqoeck3spKP0Y27DxLqmQP5AELNE12cDySVzuS2a0D/2OnQ+s4zSX7REwi/X/C6OiUYxGqPbZ7vMHhUJ/8J/cqo3MC540OUjA1ea3W2Uoc3yucsz6WHQpkNcHOIgEfkVTu2peQYxoFNV07xyFFk0e3Hx4H3W/7u6b5w==||U2FsdGVkX1/DUN3VqpHv4oEzdor/lT/FMUPOKJCOMZEod3LwEEPlTG0baksfKMnBKwC2Nup6kLyXRRwBAMdzFMNQufBFemennh9J8L+BuhA=\nX5V1O0Mwp1wZBMx/TSgIRExgtHL2DW0XPUvQCxhGDjrvczTyaW6xHZ/TU/ph7/BAfUED7o8HE268KXxE08xlk/V/vR+h56auCtS0j4NnOaOG2VOe8Yl+FCKxto8+MpU0DcL9d8SUD7W1bNMTHej3LwX6d5uM9t7IFfg9513/iJ/GwHWLwIompsM5OR7+SvKfJM6+DdJ2pnJtAKo0PX80Bh87znmPR7yVJcZ6+RavrVc1h3yuAf7QzP1xGtdF3fhnd01T3cOa74w1EGdQIl0yntMLoDgwAuc1jtDfI9R1C8MnzaaD+tnKo9S18AVsSY8Pj3G4jE/iNU4CHI9PQigz7g==\n====END LICENSE KEY====",
      // Plugins a utilizar ya importandos anteriormente
      plugins: [
        TimelinePointer(),
        Selection(),
        ItemMovement(itemMovementOptions), // Se agrega la configuracion creada
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

  const callback = useCallback((element) => {
    if (element) initializeGSTC(element);
  },);

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
