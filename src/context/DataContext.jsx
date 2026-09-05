import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  school    as defaultSchool,
  majors    as defaultMajors,
  achievements as defaultAchievements,
  news      as defaultNews,
  facilities as defaultFacilities,
} from "../data/mockData";

const KEYS = {
  session:      "smk_admin_session",
  role:         "smk_dashboard_role",
};

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [school,       setSchoolState]       = useState(defaultSchool);
  const [majors,       setMajorsState]       = useState(defaultMajors);
  const [achievements, setAchievementsState] = useState(defaultAchievements);
  const [news,         setNewsState]         = useState(defaultNews);
  const [facilities,   setFacilitiesState]   = useState(defaultFacilities);
  const [pins,         setPinsState]         = useState([]);

  // Load from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [schRes, majRes, achRes, newsRes, facRes, pinsRes] = await Promise.all([
          fetch('/api/school'),
          fetch('/api/majors'),
          fetch('/api/achievements'),
          fetch('/api/news'),
          fetch('/api/facilities'),
          fetch('/api/pins')
        ]);
        
        if (schRes.ok) setSchoolState(await schRes.json());
        if (majRes.ok) setMajorsState(await majRes.json());
        if (achRes.ok) setAchievementsState(await achRes.json());
        if (newsRes.ok) setNewsState(await newsRes.json());
        if (facRes.ok) setFacilitiesState(await facRes.json());
        if (pinsRes.ok) {
          const pData = await pinsRes.json();
          if (pData.success) setPinsState(pData.pins);
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);sas
      }
    };
    loadData();
  }, []);

  const updateSchool = useCallback(async (data) => {
    setSchoolState(data);
    await fetch('/api/school', { method: 'PUT', body: JSON.stringify(data) });
  }, []);

  const updateMajors = useCallback(async (data) => {
    setMajorsState(data);
    await fetch('/api/majors', { method: 'PUT', body: JSON.stringify(data) });
  }, []);

  const updateAchievements = useCallback(async (data) => {
    setAchievementsState(data);
    await fetch('/api/achievements', { method: 'PUT', body: JSON.stringify(data) });
  }, []);

  const updateNews = useCallback(async (data) => {
    // getRole is a synchronous function here, but we can't easily access state in useCallback without it being a dependency
    // Instead we can just pass the role to the API
    let role = null;
    try { role = JSON.parse(localStorage.getItem(KEYS.role)); } catch {}
    
    setNewsState(data); // optimistic update
    await fetch('/api/news', { method: 'PUT', body: JSON.stringify({ news: data, role }) });
    
    // reload news to get merged list
    const res = await fetch('/api/news');
    if (res.ok) setNewsState(await res.json());
  }, []);

  const updateFacilities = useCallback(async (data) => {
    setFacilitiesState(data);
    await fetch('/api/facilities', { method: 'PUT', body: JSON.stringify(data) });
  }, []);

  const updatePins = useCallback(async (data) => {
    setPinsState(data);
    const res = await fetch('/api/pins', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const resData = await res.json();
    if (resData.success) {
      setPinsState(resData.pins);
      return { success: true };
    }
    return { success: false, error: resData.error };
  }, []);

  // ── Session management ──
  const getSession = ()      => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(KEYS.session) === "true";
    }
    return false;
  };
  
  const getRole = () => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem(KEYS.role) || 'null'); } catch { return null; }
    }
    return null;
  };
  
  const setSession = (val, role = null) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.session, val ? "true" : "false");
      if (val && role) localStorage.setItem(KEYS.role, JSON.stringify(role));
      else if (!val) localStorage.removeItem(KEYS.role);
    }
  };
  
  const clearSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(KEYS.session);
      localStorage.removeItem(KEYS.role);
    }
  };

  const getPin = () => "1234";

  return (
    <DataContext.Provider value={{
      school, updateSchool,
      majors, updateMajors,
      achievements, updateAchievements,
      news, updateNews,
      facilities, updateFacilities,
      pins, updatePins,
      getSession, getRole, setSession, clearSession,
      getPin
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData harus digunakan di dalam <DataProvider>");
  return ctx;
}
