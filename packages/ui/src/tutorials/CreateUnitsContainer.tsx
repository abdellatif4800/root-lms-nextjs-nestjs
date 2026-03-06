'use client'

import { useMemo } from "react"

export function CreateUnitsContainer({ units = [], currentUnit, onAddUnit, onSelectUnit, onUpdateUnit }: any) {

  const sortedUnits = useMemo(() => [...units].sort((a, b) => a.order - b.order), [units])

  // Helper to instantly add a blank new unit
  const handleAddNewUnit = () => {
    const newOrder = units.length > 0 ? Math.max(...units.map((u: any) => u.order)) + 1 : 1;
    const newUnit = {
      unitTitle: `NEW_UNIT_${newOrder}`,
      order: newOrder,
      content: "",
      publish: false
    };
    onAddUnit(newUnit);
  };

  return (
    <div className="flex flex-col h-full">

      {/* Scrollable Unit List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {sortedUnits.length === 0 && (
          <div className="text-center py-8 text-[10px] text-surface-700 font-mono italic">
            NO_UNITS_INITIALIZED...
          </div>
        )}

        {sortedUnits.map((unit) => {
          const isActive = currentUnit?.order === unit.order;
          return (
            <div
              key={unit.order}
              onClick={() => onSelectUnit(unit)}
              className={`
                cursor-pointer p-3 border transition-all duration-200 relative group
                ${isActive
                  ? "bg-surface-800 border-teal-glow shadow-[0_0_10px_rgba(45,212,191,0.1)]"
                  : "bg-surface-950 border-surface-700 hover:border-purple-glow hover:bg-surface-900"
                }
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-teal-glow' : 'text-text-secondary group-hover:text-purple-glow'}`}>
                  UNIT_{unit.order.toString().padStart(2, '0')}
                </span>

                {/* Compact Radio Control for List Item */}
                <div
                  className="flex border border-surface-700 rounded-sm overflow-hidden bg-surface-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label className={`cursor-pointer px-1.5 py-0.5 text-[8px] font-bold uppercase transition-colors ${!unit.publish ? 'bg-surface-700 text-white' : 'text-surface-600 hover:text-surface-400'}`}>
                    <input
                      type="radio"
                      className="hidden"
                      checked={!unit.publish}
                      // Pass both the updated unit, and the old unit (so parent can find it)
                      onChange={() => onUpdateUnit && onUpdateUnit({ ...unit, publish: false }, unit)}
                    />
                    DRF
                  </label>
                  <div className="w-px bg-surface-700"></div>
                  <label className={`cursor-pointer px-1.5 py-0.5 text-[8px] font-bold uppercase transition-colors ${unit.publish ? 'bg-teal-glow text-black' : 'text-teal-glow hover:text-white'}`}>
                    <input
                      type="radio"
                      className="hidden"
                      checked={unit.publish}
                      onChange={() => onUpdateUnit && onUpdateUnit({ ...unit, publish: true }, unit)}
                    />
                    PUB
                  </label>
                </div>
              </div>

              <div className={`font-mono text-xs truncate ${isActive ? 'text-white' : 'text-text-primary'}`}>
                {unit.unitTitle}
              </div>
            </div>
          )
        })}

        {/* The New "Add Unit" Button */}
        <button
          onClick={handleAddNewUnit}
          className="w-full mt-4 py-2 border border-dashed border-surface-700 text-surface-500 hover:text-teal-glow hover:border-teal-glow transition-colors text-[10px] font-bold tracking-widest uppercase"
        >
          [+ Add_New_Unit ]
        </button>
      </div>

      {/* Active Unit Editor Form (Bottom Docked) */}
      {currentUnit && (
        <div className="p-3 border-t-2 border-surface-800 bg-surface-950/50 shrink-0">
          <div className="text-[9px] font-bold text-teal-glow mb-2 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-glow"></span>
            Edit_Active_Unit
          </div>

          <div className="space-y-2">
            {/* Title Input */}
            <input
              className="w-full bg-surface-900 border border-surface-700 text-xs p-2 text-white placeholder:text-surface-600 focus:border-teal-glow focus:outline-none font-mono"
              type="text"
              placeholder="TITLE_STRING"
              value={currentUnit.unitTitle || ''}
              onChange={(e) => onUpdateUnit && onUpdateUnit({ ...currentUnit, unitTitle: e.target.value }, currentUnit)}
            />

            <div className="flex gap-2">
              {/* Order Input */}
              <input
                className="w-14 bg-surface-900 border border-surface-700 text-xs p-2 text-white placeholder:text-surface-600 focus:border-teal-glow focus:outline-none font-mono text-center"
                type="number"
                placeholder="#"
                value={currentUnit.order || ''}
                onChange={(e) => onUpdateUnit && onUpdateUnit({ ...currentUnit, order: Number(e.target.value) }, currentUnit)}
              />

              {/* Status Toggle */}
              <div className="flex flex-1 bg-surface-900 border border-surface-700">
                <label className={`flex-1 flex items-center justify-center cursor-pointer text-[9px] font-bold uppercase transition-colors ${!currentUnit.publish ? 'bg-surface-700 text-white' : 'text-surface-500 hover:text-surface-300'}`}>
                  <input
                    type="radio"
                    name="edit_unit_status"
                    className="hidden"
                    checked={!currentUnit.publish}
                    onChange={() => onUpdateUnit && onUpdateUnit({ ...currentUnit, publish: false }, currentUnit)}
                  />
                  Draft
                </label>
                <div className="w-px bg-surface-700"></div>
                <label className={`flex-1 flex items-center justify-center cursor-pointer text-[9px] font-bold uppercase transition-colors ${currentUnit.publish ? 'bg-teal-glow text-black' : 'text-teal-glow hover:text-white'}`}>
                  <input
                    type="radio"
                    name="edit_unit_status"
                    className="hidden"
                    checked={currentUnit.publish}
                    onChange={() => onUpdateUnit && onUpdateUnit({ ...currentUnit, publish: true }, currentUnit)}
                  />
                  Live
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
