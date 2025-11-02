import Modal from "../components/Modal";
import { useState, useEffect } from "react"
import ModalExcluir from "../components/ModalExclusao";
// Funções utilitárias para localStorage
const STORAGE_KEYS = {
    PAGES: 'webPageManager_pages',
    SETTINGS: 'webPageManager_settings'
    
};




const loadPagesFromStorage = () => {
    try {
        const savedPages = localStorage.getItem(STORAGE_KEYS.PAGES);
        if (savedPages) {
            return JSON.parse(savedPages);
        }
    } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
    }

    // Dados padrão se não houver no localStorage
    return [
        {
            id: 1,
            title: "YouTube",
            url: "https://youtube.com",
            category: "youtube",
            favicon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=32",
            subTabs: []
        },
        {
            id: 2,
            title: "LinkedIn",
            url: "https://linkedin.com",
            category: "linkedin",
            favicon: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=32",
            subTabs: []
        },
        {
            id: 3,
            title: "GitHub",
            url: "https://github.com",
            category: "github",
            favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=32",
            subTabs: []
        },
    ];
};

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

export default function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubTabModalOpen, setIsSubTabModalOpen] = useState(false);
    const [currentPageId, setCurrentPageId] = useState(null);
    const [pages, setPages] = useState(loadPagesFromStorage);
    const [search, setSearch] = useState("");

    const [isOpenExluir,setIsOpenExluir] =  useState (false)
    const [pageToDelete, setPageToDelete] = useState(null)

    const filter = pages.filter((page) =>
        page.title.toLowerCase().includes(search.toLowerCase())
    );








    // Salva no localStorage sempre que pages mudar
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.PAGES, pages);
    }, [pages]);

    // Carrega configurações ao inicializar
    useEffect(() => {
        const settings = loadFromStorage(STORAGE_KEYS.SETTINGS, {});
        // Aqui você pode carregar outras configurações como tema, layout, etc.
        console.log('Configurações carregadas:', settings);
    }, []);

    const addPage = (newPageData) => {
        const newPage = {
            ...newPageData,
            subTabs: []
        };
        setPages([newPage, ...pages]);
    };

    const deletePage = (id) => {
        setPages(pages.filter(page => page.id !== id));
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
            console.log('URL copiada:', url);
        } catch (err) {
            console.error('Erro ao copiar URL:', err);
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
            setPages(prevPages =>
                prevPages.map(page =>
                    page.id === currentPageId
                        ? {
                            ...page,
                            subTabs: [
                                ...page.subTabs,
                                {
                                    id: Date.now(),
                                    title: subTabData.title,
                                    url: subTabData.url
                                }
                            ]
                        }
                        : page
                )
            );
        }
        closeSubTabModal();
    };

    const deleteSubTab = (pageId, subTabId) => {
        setPages(prevPages =>
            prevPages.map(page =>
                page.id === pageId
                    ? {
                        ...page,
                        subTabs: page.subTabs.filter(subTab => subTab.id !== subTabId)
                    }
                    : page
            )
        );
    };

    // Função para limpar todos os dados (desenvolvimento/reset)
    const clearAllData = () => {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
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
                version: '1.0'
            };

            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `gerenciador-paginas-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            alert('Configurações exportadas com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar configurações:', error);
            alert('Erro ao exportar configurações. Verifique o console para mais detalhes.');
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
                    throw new Error('Formato de arquivo inválido: páginas não encontradas');
                }

                // Confirmar importação
                const confirmMessage = `Deseja importar as configurações?\n\n` +
                    `Data do backup: ${importedData.exportDate ? new Date(importedData.exportDate).toLocaleString('pt-BR') : 'Não informada'}\n` +
                    `Páginas: ${importedData.pages.length}\n` +
                    `Versão: ${importedData.version || 'Não informada'}\n\n` +
                    `⚠️ ATENÇÃO: Isso substituirá todas as suas configurações atuais!`;

                if (confirm(confirmMessage)) {
                    // Salvar dados importados
                    setPages(importedData.pages);
                    saveToStorage(STORAGE_KEYS.PAGES, importedData.pages);
                    
                    if (importedData.settings) {
                        saveToStorage(STORAGE_KEYS.SETTINGS, importedData.settings);
                    }
                    
                    alert('Configurações importadas com sucesso!');
                }
            } catch (error) {
                console.error('Erro ao importar configurações:', error);
                alert('Erro ao importar configurações. Verifique se o arquivo está no formato correto.');
            }
        };
        
        reader.readAsText(file);
        // Limpar o input para permitir reimportar o mesmo arquivo
        event.target.value = '';
    };

    return (

        


        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full h-screen flex flex-col">
            {/* Header Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
                <div className="absolute inset-0 opacity-40">
                    <div className="w-full h-full" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
                </div>
                
                <div className="relative w-full flex items-center justify-center py-1 px-6">
                    <div className="text-center">
                        {/* Main Title */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <h1 className="text-5xl font-bold h-14 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                               Gerenciador de Páginas Web
                            </h1>
                        </div>
                        
                        {/* <p className="text-xl text-gray-600 mb-2 font-light">
                          
                        </p> */}
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Organize, gerencie e acesse todas as suas páginas favoritas em um só lugar
                        </p>
                    </div>
                </div>
                
                {/* Controls */}
                <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
                    {/* Auto-save indicator */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm border border-white/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-600 font-medium">Auto-save</span>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={exportSettings}
                            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-green-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-white/20 hover:shadow-md"
                            title="Exportar configurações"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Exportar
                        </button>
                        
                        <label className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-white/20 hover:shadow-md cursor-pointer"
                               title="Importar configurações"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Importar
                            <input
                                type="file"
                                accept=".json"
                                onChange={importSettings}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            <div className="relative -mt-4 mb-6 px-6 bg-[#eaecfd]">
                <div className="max-w-2xl mx-auto">
                    <div className="backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative flex-1 min-w-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap"
                                onClick={() => setIsOpen(true)}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Nova Página</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>




            <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8">


                    {/* Cards das páginas existentes */}
                    {filter.map((page) => (
                        <div
                            key={page.id}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 h-96 max-h-96 overflow-hidden"
                        >
                            {/* Cabeçalho do Card */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer bg-gradient-to-r from-gray-50 to-white ">
                                <div
                                    className="flex items-center gap-3 flex-1  "
                                onClick={() => window.open(page.url, '_blank')}
                                >
                                    <img
                                        alt={`Favicon de ${page.title}`}
                                        className="w-6 h-6 rounded"
                                        src={page.favicon}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/24";
                                        }}
                                    />
                                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{page.title}</h2>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openSubTabModal(page.id);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 "
                                        title="Adicionar sub-aba"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPageToDelete(page.id);
                                            setIsOpenExluir(true);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                                        title="Excluir página"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                                                scrollbarWidth: 'thin',
                                                scrollbarColor: '#d1d5db #f3f4f6'
                                            }}
                                        >
                                            {page.subTabs.map((subTab) => (
                                                <div
                                                    key={subTab.id}
                                                    className="group flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200"
                                                >
                                                    <div
                                                        className="flex-1 cursor-pointer"
                                                        onClick={() => window.open(subTab.url, '_blank')}
                                                    >
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {subTab.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyToClipboard(subTab.url);
                                                            }}
                                                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                                                            title="Copiar URL"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteSubTab(page.id, subTab.id);
                                                            }}
                                                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                                                            title="Excluir sub-aba"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 text-sm text-center">
                                            Nenhuma sub-aba ainda<br />
                                            <span className="text-xs text-gray-400">Clique no + para adicionar</span>
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
                        
                  
                    
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                onSubmit={addPage}
            />

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
        url: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
            <div
                className="fixed inset-0  bg-[#080808f1]"
                onClick={onClose}
            />

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
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Título */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Titulo da Página 
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Ex: Dashboard, Configurações..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        {/* URL */}
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                                URL  da Página
                            </label>
                            <input
                                type="url"
                                id="url"
                                name="url"
                                value={formData.url}
                                onChange={handleInputChange}
                                placeholder="https://exemplo.com/subpagina"
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




