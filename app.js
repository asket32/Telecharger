const input = document.querySelector("input");
const btn = document.querySelector("button");
const message = document.querySelector(".message"); // zone pour afficher les erreurs

btn.addEventListener("click", async (event) => {
  event.preventDefault();

  const url = input.value.trim();

  if (!url) {
    showMessage("Veuillez entrer une URL valide.", "error");
    return;
  }

  await downloadFile(url);
});

async function downloadFile(url) {
  try {
    showMessage("Téléchargement en cours...", "info");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const blob = await response.blob();

    // Récupérer le nom du fichier depuis les headers si possible
    let fileName = "download";

    const contentDisposition = response.headers.get("content-disposition");
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match?.[1]) {
        fileName = match[1];
      }
    } else {
      // Sinon on tente de récupérer le nom depuis l’URL
      fileName = url.split("/").pop().split("?")[0] || "download";
    }

    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Nettoyage
    a.remove();
    window.URL.revokeObjectURL(blobUrl);

    showMessage("Téléchargement terminé ", "success");
  } catch (error) {
    console.error(error);
    showMessage("Impossible de télécharger le fichier.", "error");
  }
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = "message " + type;
}
