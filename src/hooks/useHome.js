import { useState, useEffect } from "react";

// Funções utilitárias para localStorage
const STORAGE_KEYS = {
  PAGES: "webPageManager_pages",
  SETTINGS: "webPageManager_settings",
};

const loadPagesFromStorage = () => {
  try {
    const savedPages = localStorage.getItem(STORAGE_KEYS.PAGES);
    if (savedPages) {
      return JSON.parse(savedPages);
    }
  } catch (error) {
    console.error("Erro ao carregar dados do localStorage:", error);
  }
 
  return [];
};

export function useHome() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubTabModalOpen, setIsSubTabModalOpen] = useState(false);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [pages, setPages] = useState(loadPagesFromStorage);
  const [search, setSearch] = useState("");
  const [isOpenExluir, setIsOpenExluir] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);

  const filter = pages.filter((page) =>
    page.title.toLowerCase().includes(search.toLowerCase()),
  );


  const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
  }
};
  const loadFromStorage = (key, defaultValue = null) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error);
      return defaultValue;
    }
  };

  // Salva no localStorage sempre que pages mudar
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PAGES, pages);
  }, [pages]);

  // Carrega configurações ao inicializar
  useEffect(() => {
    const settings = loadFromStorage(STORAGE_KEYS.SETTINGS, {});
    // Aqui você pode carregar outras configurações como tema, layout, etc.
    console.log("Configurações carregadas:", settings);
  }, []);

  const addPage = (newPageData) => {
    const newPage = {
      ...newPageData,
      subTabs: [],
    };
    setPages([newPage, ...pages]);
  };

  const deletePage = (id) => {
    setPages(pages.filter((page) => page.id !== id));
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeDeleteModal = () => {
    setIsOpenExluir(false);
    setPageToDelete(null);
  };

  const confirmDelete = () => {
    if (pageToDelete) {
      deletePage(pageToDelete);
      closeDeleteModal();
    }
  };

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      // Você pode adicionar uma notificação aqui
      console.log("URL copiada:", url);
    } catch (err) {
      console.error("Erro ao copiar URL:", err);
    }
  };

  const openSubTabModal = (pageId) => {
    setCurrentPageId(pageId);
    setIsSubTabModalOpen(true);
  };

  const closeSubTabModal = () => {
    setIsSubTabModalOpen(false);
    setCurrentPageId(null);
  };

  const addSubTab = (subTabData) => {
    if (currentPageId) {
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.id === currentPageId
            ? {
                ...page,
                subTabs: [
                  ...page.subTabs,
                  {
                    id: Date.now(),
                    title: subTabData.title,
                    url: subTabData.url,
                  },
                ],
              }
            : page,
        ),
      );
    }
    closeSubTabModal();
  };

  const deleteSubTab = (pageId, subTabId) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              subTabs: page.subTabs.filter((subTab) => subTab.id !== subTabId),
            }
          : page,
      ),
    );
  };

  // Função para limpar todos os dados (desenvolvimento/reset)
  const clearAllData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.",
      )
    ) {
      localStorage.removeItem(STORAGE_KEYS.PAGES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      window.location.reload(); // Recarrega a página para mostrar dados padrão
    }
  };

  // Função para exportar configurações
  const exportSettings = () => {
    try {
      const dataToExport = {
        pages: pages,
        settings: loadFromStorage(STORAGE_KEYS.SETTINGS, {}),
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `gerenciador-paginas-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Configurações exportadas com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar configurações:", error);
      alert(
        "Erro ao exportar configurações. Verifique o console para mais detalhes.",
      );
    }
  };

  // Função para importar configurações
  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validar estrutura dos dados
        if (!importedData.pages || !Array.isArray(importedData.pages)) {
          throw new Error(
            "Formato de arquivo inválido: páginas não encontradas",
          );
        }

        // Confirmar importação
        const confirmMessage =
          `Deseja importar as configurações?\n\n` +
          `Data do backup: ${importedData.exportDate ? new Date(importedData.exportDate).toLocaleString("pt-BR") : "Não informada"}\n` +
          `Páginas: ${importedData.pages.length}\n` +
          `Versão: ${importedData.version || "Não informada"}\n\n` +
          `⚠️ ATENÇÃO: Isso substituirá todas as suas configurações atuais!`;

        if (confirm(confirmMessage)) {
          // Salvar dados importados
          setPages(importedData.pages);
          saveToStorage(STORAGE_KEYS.PAGES, importedData.pages);

          if (importedData.settings) {
            saveToStorage(STORAGE_KEYS.SETTINGS, importedData.settings);
          }

          alert("Configurações importadas com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao importar configurações:", error);
        alert(
          "Erro ao importar configurações. Verifique se o arquivo está no formato correto.",
        );
      }
    };

    reader.readAsText(file);
    // Limpar o input para permitir reimportar o mesmo arquivo
    event.target.value = "";
  };

  return {
    isOpen,
    setIsOpen,
    pages,
    addPage,
    deletePage,
    closeModal,
    filter,
    search,
    setSearch,
    copyToClipboard,
    openSubTabModal,
    isSubTabModalOpen,
    closeSubTabModal,
    addSubTab,
    deleteSubTab,
    isOpenExluir,
    setIsOpenExluir,
    pageToDelete,
    setPageToDelete,
    confirmDelete,
    closeDeleteModal,
    clearAllData,
    exportSettings,
    importSettings,
  };
}
