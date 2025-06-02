// src/components/CalorieCalendar.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  dateFnsLocalizer,
  Event as RbcEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

// 如果需要中文介面，可加裝 date-fns/locale/zh-TW
import { zhTW } from "date-fns/locale";

// 1. 設定 localizer，用 date-fns 做格式化、解析
const locales = {
  "zh-TW": zhTW,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: locales["zh-TW"] }),
  getDay,
  locales,
});

interface EventPayload {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: "calorie" | "exercise" | "note";
  extra?: string; // 備註或其他細節
}

// 2. 從後端抓所有事件
async function fetchEvents(): Promise<EventPayload[]> {
  const res = await fetch("/api/events");
  if (!res.ok) {
    throw new Error("fetchEvents 失敗");
  }
  return res.json();
}

export default function CalorieCalendar() {
  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery<EventPayload[], Error>({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // 3. Calendar 的 event 物件必須符合 RbcEvent interface
  // 我們把從後端抓到的 EventPayload 轉成 { title, start, end, allDay? } 格式
  const mappedEvents: RbcEvent[] = events.map((ev) => ({
    title: ev.title,
    start: new Date(ev.start),
    end: new Date(ev.end),
    allDay: ev.allDay ?? true,
    resource: {
      id: ev.id,
      type: ev.type,
      extra: ev.extra,
    },
  }));

  if (isLoading) {
    return <div className="p-4">載入中…</div>;
  }
  if (isError) {
    return <div className="p-4 text-red-500">事件載入失敗</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] p-4 bg-white dark:bg-neutral-800 rounded-lg shadow">
      <Calendar
        localizer={localizer}
        events={mappedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        defaultView="month"
        views={["month", "week", "day"]}
        eventPropGetter={(event) => {
          // 根據 type 給不同顏色
          const type = (event.resource as any).type as string;
          let bg = "";
          switch (type) {
            case "calorie":
              bg = "bg-green-200 dark:bg-green-700";
              break;
            case "exercise":
              bg = "bg-blue-200 dark:bg-blue-700";
              break;
            case "note":
              bg = "bg-yellow-200 dark:bg-yellow-700";
              break;
            default:
              bg = "bg-gray-200 dark:bg-gray-700";
          }
          return {
            className: `${bg} text-black dark:text-white border-none rounded-md`,
          };
        }}
        onSelectEvent={(event) => {
          // 點擊事件時可以跳 modal 或跳轉細項頁
          const resource = (event.resource as any) || {};
          alert(
            `事件：${event.title}\n種類：${resource.type}\n備註：${
              resource.extra || "無"
            }`
          );
        }}
      />
    </div>
  );
}
