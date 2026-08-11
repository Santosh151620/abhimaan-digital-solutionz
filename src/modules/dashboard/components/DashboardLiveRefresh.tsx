"use client";

import { RefreshCw } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";


const REFRESH_INTERVAL_MS = 2 * 60 * 1000;
const REFRESH_FEEDBACK_MS = 800;


function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}


export default function DashboardLiveRefresh() {

  const router = useRouter();


  const [
    lastUpdated,
    setLastUpdated,
  ] = useState<Date | null>(null);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const refreshingRef =
    useRef(false);


const feedbackTimerRef =
  useRef<number | null>(null);


  const mountedRef =
    useRef(true);



  const refreshDashboard =
    useCallback(() => {

      if (
        document.visibilityState !== "visible" ||
        refreshingRef.current
      ) {
        return;
      }


      refreshingRef.current = true;


      if (mountedRef.current) {
        setRefreshing(true);
        setLastUpdated(new Date());
      }


      router.refresh();


      if (
        feedbackTimerRef.current !== null
      ) {
        window.clearTimeout(
          feedbackTimerRef.current,
        );
      }


      feedbackTimerRef.current =
        window.setTimeout(() => {

          refreshingRef.current = false;


          if (mountedRef.current) {
            setRefreshing(false);
          }


          feedbackTimerRef.current = null;


        }, REFRESH_FEEDBACK_MS);


    }, [router]);



  useEffect(() => {
mountedRef.current = true;


const initialUpdateTimer =
  window.setTimeout(() => {
    if (mountedRef.current) {
      setLastUpdated(new Date());
    }
  }, 0);


const interval =
  window.setInterval(() => {

        if (
          document.visibilityState === "visible"
        ) {
          refreshDashboard();
        }

      }, REFRESH_INTERVAL_MS);



    function handleVisibilityChange() {

      if (
        document.visibilityState === "visible"
      ) {
        refreshDashboard();
      }

    }


    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );


    return () => {

      mountedRef.current = false;

window.clearTimeout(
  initialUpdateTimer,
);

      window.clearInterval(
        interval,
      );


      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );


      if (
        feedbackTimerRef.current !== null
      ) {

        window.clearTimeout(
          feedbackTimerRef.current,
        );


        feedbackTimerRef.current = null;

      }


      refreshingRef.current = false;

    };

  }, [refreshDashboard]);



  return (
    <div
      className="flex items-center gap-2 text-[10px] text-slate-500"
      aria-live="polite"
    >

      <span
        className={`h-1.5 w-1.5 rounded-full ${
          refreshing
            ? "bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.7)]"
            : "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.55)]"
        }`}
        aria-hidden="true"
      />


      <span>
        {refreshing
          ? "Refreshing intelligence..."
          : lastUpdated
            ? `Updated ${formatTime(lastUpdated)}`
            : "Preparing live data"}
      </span>


      <button
        type="button"
        onClick={refreshDashboard}
        disabled={refreshing}
        aria-label={
          refreshing
            ? "Refreshing dashboard"
            : "Refresh dashboard intelligence"
        }
        title="Refresh dashboard"
        className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.025] text-slate-500 transition hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50"
      >

        <RefreshCw
          className={`h-3 w-3 ${
            refreshing
              ? "animate-spin"
              : ""
          }`}
          aria-hidden="true"
        />

      </button>

    </div>
  );
}