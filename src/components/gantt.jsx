import React, { useCallback, useEffect, useState } from "react";
import { DateTime } from "luxon";
import "gantt-schedule-timeline-calendar/dist/style.css";

function Gantt({ datosUsrs, datosActivity }) {
  const [GSTC, setGSTC] = useState(null);
  const [gstc, setGstc] = useState(null);
  const [state, setState] = useState(null);

  async function initializeGSTC(element) {
    const ganttScheduleTimelineCalendar = await import("gantt-schedule-timeline-calendar");
    const GSTC = ganttScheduleTimelineCalendar.default;

    const TimelinePointer = (await import("gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js")).Plugin;
    const Selection = (await import("gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js")).Plugin;
    const ItemMovement = (await import("gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js")).Plugin;

    const itemMovementOptions = {
      events: {
        onMove({ items }) {
          return items.before.map((beforeMovementItem, index) => {
            const afterMovementItem = items.after[index];
            const myItem = GSTC.api.merge({}, afterMovementItem);

            myItem.time.start = beforeMovementItem.time.start;
            myItem.time.end = beforeMovementItem.time.end;
            return myItem;
          });
        },
      },
    };

    function generateRows() {
      const rows = {};
      datosUsrs.forEach((data) => {
        const id = GSTC.api.GSTCID(data.eCorreo);
        rows[id] = {
          id,
          label: `${data.eNombre} ${data.eApeP} ${data.eApeM}`,
        };
      });
      return rows;
    }

    function generateItems() {
      const items = {};
      datosActivity.forEach((data, i) => {
        let startDate = new Date(data.fechaI);
        let endDate = new Date(data.fechaF);
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

    const config = {
      licenseKey: "YOUR_LICENSE_KEY",
      plugins: [
        TimelinePointer(),
        Selection(),
        //ItemMovement(itemMovementOptions),
      ],
      list: {
        columns: {
          data: {
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
        rows: generateRows(),
      },
      chart: {
        items: generateItems(),
      },
    };

    const newState = GSTC.api.stateFromConfig(config);
    setState(newState);
    setGSTC(GSTC);
    setGstc(GSTC({ element, state: newState }));
  }

  const callback = useCallback((element) => {
    if (element) initializeGSTC(element);
  }, []);

  useEffect(() => {
    return () => {
      if (gstc) {
        gstc.destroy();
      }
    };
  }, [gstc]);

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

export default Gantt;
