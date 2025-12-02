import axios from "axios";

export const handleDownload = async () => {
  try {
    const response = await axios.get("/api/reporter/orders", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar el CSV:", error);
    alert("Ocurrió un error al generar el reporte.");
  }
};
