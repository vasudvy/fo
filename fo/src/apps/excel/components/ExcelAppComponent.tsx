import { AppProps } from "@/apps/base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { useExcelStore } from "@/stores/useExcelStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Download, Upload } from "lucide-react";
import { useState } from "react";

export function ExcelAppComponent({
  isWindowOpen,
  onClose,
  isForeground,
}: AppProps) {
  const {
    workbooks,
    activeWorkbookId,
    createWorkbook,
    openWorkbook,
    saveWorkbook,
  } = useExcelStore();

  const [newWorkbookName, setNewWorkbookName] = useState("");

  const handleCreateWorkbook = () => {
    if (newWorkbookName.trim()) {
      createWorkbook(newWorkbookName);
      setNewWorkbookName("");
    }
  };

  const activeWorkbook = activeWorkbookId ? workbooks[activeWorkbookId] : null;

  return (
    <WindowFrame
      title="Excel"
      isOpen={isWindowOpen}
      onClose={onClose}
      isForeground={isForeground}
    >
      <div className="flex flex-col h-full bg-white">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Input
              value={newWorkbookName}
              onChange={(e) => setNewWorkbookName(e.target.value)}
              placeholder="New workbook name..."
              className="w-48"
              onKeyPress={(e) => e.key === "Enter" && handleCreateWorkbook()}
            />
            <Button 
              onClick={handleCreateWorkbook}
              size="sm"
              disabled={!newWorkbookName.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Create
            </Button>
          </div>
          
          {activeWorkbook && (
            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={() => saveWorkbook(activeWorkbook.id)}
                size="sm"
                variant="outline"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline">
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {activeWorkbook ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">{activeWorkbook.name}</h2>
              
              {/* Worksheet tabs */}
              <div className="flex gap-2 mb-4 border-b">
                {activeWorkbook.worksheets.map((worksheet) => (
                  <button
                    key={worksheet.id}
                    className={`px-3 py-1 text-sm rounded-t-lg border-t border-l border-r ${
                      worksheet.id === activeWorkbook.activeWorksheetId
                        ? "bg-white border-gray-300"
                        : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    {worksheet.name}
                  </button>
                ))}
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                  + Add Sheet
                </button>
              </div>

              {/* Spreadsheet grid placeholder */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-2 text-sm font-medium border-b">
                  Spreadsheet Grid (Coming Soon)
                </div>
                <div className="h-96 bg-white flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p>Spreadsheet grid will be implemented here</p>
                    <p className="text-sm mt-2">Including formulas, charts, and pivot tables</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Recent Workbooks</h2>
              
              {Object.values(workbooks).length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold mb-2">Welcome to Excel</h3>
                    <p className="mb-4">Create your first workbook to get started</p>
                    <Button onClick={() => createWorkbook("My First Workbook")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Workbook
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.values(workbooks).map((workbook) => (
                    <div
                      key={workbook.id}
                      className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-shadow"
                      onClick={() => openWorkbook(workbook.id)}
                    >
                      <div className="text-xl mb-2">📊</div>
                      <h3 className="font-semibold truncate">{workbook.name}</h3>
                      <p className="text-sm text-gray-600">
                        {workbook.worksheets.length} sheet{workbook.worksheets.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Modified {workbook.modifiedAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
}