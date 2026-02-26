export function ImportExport({ exportSettings, importSettings }) {

return(
        
        <div className="mt-5 lg:absolute top-6 right-6 flex flex-col  gap-3  w-full  items-center juscify-center lg:w-auto lg:bg-transparent">
       
          {/* Action buttons */}
              <div className="flex items-center gap-2">
            <button
              onClick={exportSettings}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-green-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-white/20 hover:shadow-md"
              title="Exportar configurações"
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              Exportar
            </button>

            <label
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-white/20 hover:shadow-md cursor-pointer"
              title="Importar configurações"
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
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
)

}