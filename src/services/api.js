// Mode demo: memakai data lokal.
// Saat Laravel API sudah siap, ganti fungsi di file ini dengan fetch/axios
// ke endpoint seperti /api/school, /api/majors, /api/news, dan /api/facilities.

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export async function getFromApi(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) throw new Error("Gagal mengambil data dari API");
  return response.json();
}