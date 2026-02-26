import Modal from "../components/Modal";
import { useState, useEffect } from "react";
import ModalExcluir from "../components/ModalExclusao";
import { useHome } from "../hooks/useHome";
import { ImportExport } from "../components/ImportExport";
export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const {
    isOpen,
    setIsOpen,
    addPage,
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
    setPageToDelete,
    confirmDelete,
    closeDeleteModal,
    exportSettings,
    importSettings,
  } = useHome();

  useEffect(() => {
    // Verifica a largura da tela ao carregar e ao redimensionar
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px é o breakpoint padrão 'md'
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full h-screen flex flex-col">
      {/* Header Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute inset-0 opacity-40">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative w-full flex items-center justify-center py-1 px-6 lg:py-6  ">
          <div className="text-center">
            {/* Main Title */}
            <div className="flex flex-col items-center justify-center mb-4">
              <h1
                className={` font-bold h-14 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent ${isMobile ? "text-2xl" : "text-5xl"}`}
              >
                Gerenciador de Páginas Web
              </h1>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Organize, gerencie e acesse todas as suas páginas favoritas.
              </p>
            </div>

            {/* <p className="text-xl text-gray-600 mb-2 font-light"></p>  */}

            {/* Actions Section */}
            <div className="relative  mb-6 px-6 bg-[#eaecfd]">
              <div className="max-w-2xl mx-auto">
                <div className="backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-4">
                  <div className="flex sm:flex-row items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative flex-1 min-w-0">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-white/60 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all text-sm text-gray-700 placeholder-gray-400"
                        placeholder="Buscar páginas..."
                      />
                    </div>
                    {/* Add Button */}
                    <button
                      className=" justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap"
                      onClick={() => setIsOpen(true)}
                    >
                      <span>{isMobile ? "+" : "+ Nova Página"}</span>
                    </button>
                  </div>
                </div>
                <div className="flex lg:hidden">
                  <ImportExport
                    exportSettings={exportSettings}
                    importSettings={importSettings}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex">
          <ImportExport
            exportSettings={exportSettings}
            importSettings={importSettings}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gradient-to-br mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8">
          {/* Cards das páginas existentes */}
          {filter.map((page) => (
            <div
              key={page.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 h-96 max-h-96 overflow-hidden "
            >
              {/* Cabeçalho do Card */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer bg-indigo-500/15 ">
                <div className="flex items-center gap-3 flex-1 cursor-auto  ">
                  <img
                    alt={`Favicon de ${page.title}`}
                    className="w-6 h-6 rounded"
                    src={page.favicon}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/24";
                    }}
                  />
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {page.title}
                  </h2>
                </div>
                <div className="flex items-center gap-1 transition-opacity duration-200 opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openSubTabModal(page.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 cursor-pointer"
                    title="Adicionar sub-aba"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPageToDelete(page.id);
                      setIsOpenExluir(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 cursor-pointer"
                    title="Excluir página"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Área das Sub-abas */}
              <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden flex flex-col">
                {page.subTabs && page.subTabs.length > 0 ? (
                  <div className="p-3 flex-1 overflow-hidden flex flex-col">
                    {/* <h4 className="text-sm font-medium text-gray-600 mb-3 flex-shrink-0">Sub-abas:</h4> */}
                    <div
                      className="space-y-2 overflow-y-auto flex-1 pr-1"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#d1d5db #f3f4f6",
                      }}
                    >
                      {page.subTabs.map((subTab) => (
                        <div
                          key={subTab.id}
                          className="group flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200"
                        >
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => window.open(subTab.url, "_blank")}
                          >
                            <span className="text-sm font-medium text-gray-800">
                              {subTab.title}
                            </span>
                          </div>
                          <div className="flex gap-1 transition-opacity duration-200 opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(subTab.url);
                              }}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 cursor-pointer"
                              title="Copiar URL"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSubTab(page.id, subTab.id);
                              }}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200 cursor-pointer"
                              title="Excluir sub-aba"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm text-center">
                      Nenhuma sub-aba ainda
                      <br />
                      <span className="text-xs text-gray-400">
                        Clique no + para adicionar
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalExcluir
        isOpen={isOpenExluir}
        isClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <Modal isOpen={isOpen} onClose={closeModal} onSubmit={addPage} />

      {/* Modal para adicionar sub-aba */}
      <SubTabModal
        isOpen={isSubTabModalOpen}
        onClose={closeSubTabModal}
        onSubmit={addSubTab}
      />
    </div>
  );
}

// Componente Modal para Sub-abas
function SubTabModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.url) {
      onSubmit(formData);
      setFormData({ title: "", url: "" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0  bg-[#080808f1]" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Adicionar Sub-aba
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Título */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Titulo da Sub-aba
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Youtube, Google..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* URL */}
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                URL da Página
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://exemplo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!formData.title || !formData.url}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
