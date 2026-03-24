'use client'

import { useMemo } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableUnitItem({ unit, isActive, onSelectUnit, onUpdateUnit }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: unit.order });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelectUnit(unit)}
      className={`
        cursor-pointer p-3 border-2 transition-all duration-200 relative group
        ${isDragging ? "opacity-50" : "opacity-100"}
        ${isActive
          ? "bg-background border-teal-primary shadow-wire-teal -translate-x-0.5 -translate-y-0.5"
          : "bg-surface border-ink hover:border-teal-primary hover:bg-background"
        }
      `}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-ink/5 rounded"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="9" cy="5" r="1" />
              <circle cx="9" cy="12" r="1" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="5" r="1" />
              <circle cx="15" cy="12" r="1" />
              <circle cx="15" cy="19" r="1" />
            </svg>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-teal-primary' : 'text-dust group-hover:text-ink'}`}>
            UNIT_{unit.order.toString().padStart(2, '0')}
          </span>
        </div>

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

      <div className={`font-mono text-xs font-bold truncate pl-6 ${isActive ? 'text-ink' : 'text-dust group-hover:text-ink'}`}>
        {unit.unitTitle}
      </div>
    </div>
  );
}

export function CreateUnitsContainer({ 
  units = [], 
  currentUnit, 
  onAddUnit, 
  onSelectUnit, 
  onUpdateUnit,
  onReorderUnits 
}: any) {

  const sortedUnits = useMemo(() => [...units].sort((a, b) => a.order - b.order), [units])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedUnits.findIndex((u) => u.order === active.id);
      const newIndex = sortedUnits.findIndex((u) => u.order === over.id);

      const newSortedUnits = arrayMove(sortedUnits, oldIndex, newIndex);
      
      // Re-assign orders based on new sequence
      const updatedUnits = newSortedUnits.map((u, index) => ({
        ...u,
        order: index + 1
      }));

      onReorderUnits(updatedUnits);
    }
  };

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
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {sortedUnits.length === 0 && (
          <div className="text-center py-8 text-[10px] text-dust font-mono italic">
            NO_UNITS_INITIALIZED...
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedUnits.map(u => u.order)}
            strategy={verticalListSortingStrategy}
          >
            {sortedUnits.map((unit) => (
              <SortableUnitItem
                key={unit.order}
                unit={unit}
                isActive={currentUnit?.order === unit.order}
                onSelectUnit={onSelectUnit}
                onUpdateUnit={onUpdateUnit}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          onClick={handleAddNewUnit}
          className="w-full mt-4 py-3 border-2 border-dashed border-ink text-dust hover:text-teal-primary hover:border-teal-primary transition-all text-[10px] font-black tracking-widest uppercase bg-transparent"
        >
          [+ Add_New_Unit ]
        </button>
      </div>

      {currentUnit && (
        <div className="p-3 border-t-2 border-ink bg-background shrink-0">
          <div className="text-[10px] font-black text-ink mb-2 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-primary"></span>
            Unit_Properties
          </div>

          <div className="space-y-2">
            <input
              className="w-full bg-background border-2 border-ink text-xs font-bold p-2 text-ink placeholder:text-dust/40 focus:border-teal-primary focus:outline-none font-mono"
              type="text"
              placeholder="TITLE_STRING"
              value={currentUnit.unitTitle || ''}
              onChange={(e) => onUpdateUnit && onUpdateUnit({ ...currentUnit, unitTitle: e.target.value }, currentUnit)}
            />

            <div className="flex gap-2">
              <input
                className="w-14 bg-background border-2 border-ink text-xs font-bold p-2 text-ink placeholder:text-dust/40 focus:border-teal-primary focus:outline-none font-mono text-center"
                type="number"
                placeholder="#"
                value={currentUnit.order || ''}
                onChange={(e) => onUpdateUnit && onUpdateUnit({ ...currentUnit, order: Number(e.target.value) }, currentUnit)}
              />

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
