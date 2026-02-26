// import { useHome } from "./useHome";

// export function useImportSettings() {
//   const { setPages, saveToStorage, STORAGE_KEYS } = useHome();

//   // Função para importar configurações
//   const importSettings = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const importedData = JSON.parse(e.target.result);

//         // Validar estrutura dos dados
//         if (!importedData.pages || !Array.isArray(importedData.pages)) {
//           throw new Error(
//             "Formato de arquivo inválido: páginas não encontradas",
//           );
//         }

//         // Confirmar importação
//         const confirmMessage =
//           `Deseja importar as configurações?\n\n` +
//           `Data do backup: ${importedData.exportDate ? new Date(importedData.exportDate).toLocaleString("pt-BR") : "Não informada"}\n` +
//           `Páginas: ${importedData.pages.length}\n` +
//           `Versão: ${importedData.version || "Não informada"}\n\n` +
//           `⚠️ ATENÇÃO: Isso substituirá todas as suas configurações atuais!`;

//         if (confirm(confirmMessage)) {
//           // Salvar dados importados
//           setPages(importedData.pages);
//           saveToStorage(STORAGE_KEYS.PAGES, importedData.pages);

//           if (importedData.settings) {
//             saveToStorage(STORAGE_KEYS.SETTINGS, importedData.settings);
//           }

//           alert("Configurações importadas com sucesso!");
//         }
//       } catch (error) {
//         console.error("Erro ao importar configurações:", error);
//         alert(
//           "Erro ao importar configurações. Verifique se o arquivo está no formato correto.",
//         );
//       }
//     };

//     reader.readAsText(file);
//     // Limpar o input para permitir reimportar o mesmo arquivo
//     event.target.value = "";
//   };

//     return { importSettings };

// }