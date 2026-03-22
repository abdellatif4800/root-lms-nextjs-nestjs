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
    <div className="flex flex-col h-full bg-surface">
      {/* Scrollable Unit List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {sortedUnits.length === 0 && (
          <div className="text-center py-8 text-[10px] text-dust font-mono italic">
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
                cursor-pointer p-3 border-2 transition-all duration-200 relative group
                ${isActive
                  ? "bg-background border-teal-primary shadow-wire-teal -translate-x-0.5 -translate-y-0.5"
                  : "bg-surface border-ink hover:border-teal-primary hover:bg-background"
                }
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-teal-primary' : 'text-dust group-hover:text-ink'}`}>
                  UNIT_{unit.order.toString().padStart(2, '0')}
                </span>

                {/* Compact Status Control */}
                <div
                  className="flex border-2 border-ink overflow-hidden bg-background"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label className={`cursor-pointer px-1.5 py-0.5 text-[8px] font-black uppercase transition-colors ${!unit.publish ? 'bg-ink text-background' : 'text-dust hover:text-ink'}`}>
                    <input
                      type="radio"
                      className="hidden"
                      checked={!unit.publish}
                      onChange={() => onUpdateUnit && onUpdateUnit({ ...unit, publish: false }, unit)}
                    />
                    DRF
                  </label>
                  <div className="w-px bg-ink"></div>
                  <label className={`cursor-pointer px-1.5 py-0.5 text-[8px] font-black uppercase transition-colors ${unit.publish ? 'bg-teal-primary text-background' : 'text-teal-primary hover:bg-teal-primary hover:text-background'}`}>
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

              <div className={`font-mono text-xs font-bold truncate ${isActive ? 'text-ink' : 'text-dust group-hover:text-ink'}`}>
                {unit.unitTitle}
              </div>
            </div>
          )
        })}

        {/* The New "Add Unit" Button */}
        <button
          onClick={handleAddNewUnit}
          className="w-full mt-4 py-3 border-2 border-dashed border-ink text-dust hover:text-teal-primary hover:border-teal-primary transition-all text-[10px] font-black tracking-widest uppercase bg-transparent"
        >
          [+ Add_New_Unit ]
        </button>
      </div>

      {/* Active Unit Editor Form (Bottom Docked) */}
      {currentUnit && (
        <div className="p-3 border-t-2 border-ink bg-background shrink-0">
          <div className="text-[10px] font-black text-ink mb-2 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-primary"></span>
            Unit_Properties
          </div>

          <div className="space-y-2">
            {/* Title Input */}
            <input
              className="w-full bg-background border-2 border-ink text-xs font-bold p-2 text-ink placeholder:text-dust/40 focus:border-teal-primary focus:outline-none font-mono"
              type="text"
              placeholder="TITLE_STRING"
              value={currentUnit.unitTitle || ''}
              onChange={(e) => onUpdateUnit && onUpdateUnit({ ...currentUnit, unitTitle: e.target.value }, currentUnit)}
            />

            <div className="flex gap-2">
              {/* Order Input */}
              <input
                className="w-14 bg-background border-2 border-ink text-xs font-bold p-2 text-ink placeholder:text-dust/40 focus:border-teal-primary focus:outline-none font-mono text-center"
                type="number"
                placeholder="#"
                value={currentUnit.order || ''}
                onChange={(e) => onUpdateUnit && onUpdateUnit({ ...currentUnit, order: Number(e.target.value) }, currentUnit)}
              />

              {/* Status Toggle */}
              <div className="flex flex-1 bg-background border-2 border-ink">
                <label className={`flex-1 flex items-center justify-center cursor-pointer text-[9px] font-black uppercase transition-colors ${!currentUnit.publish ? 'bg-ink text-background' : 'text-dust hover:text-ink'}`}>
                  <input
                    type="radio"
                    name="edit_unit_status"
                    className="hidden"
                    checked={!currentUnit.publish}
                    onChange={() => onUpdateUnit && onUpdateUnit({ ...currentUnit, publish: false }, currentUnit)}
                  />
                  Draft
                </label>
                <div className="w-px bg-ink"></div>
                <label className={`flex-1 flex items-center justify-center cursor-pointer text-[9px] font-black uppercase transition-colors ${currentUnit.publish ? 'bg-teal-primary text-background' : 'text-teal-primary hover:bg-teal-primary hover:text-background'}`}>
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
