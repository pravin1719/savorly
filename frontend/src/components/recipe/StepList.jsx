import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

import StepItem from "./StepItem";

function StepList({
  steps,
  onChange
}) {
  const ids = steps.map(
    (_, index) => `step-${index}`
  );

  const addStep = () => {
    onChange([
      ...steps,
      {
        description: ""
      }
    ]);
  };

  const updateStep = (
    index,
    value
  ) => {
    const updatedSteps = [...steps];

    updatedSteps[index] = {
      ...updatedSteps[index],
      description: value
    };

    onChange(updatedSteps);
  };

  const removeStep = (index) => {
    if (steps.length === 1) {
      return;
    }

    onChange(
      steps.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    onChange(
      arrayMove(
        steps,
        oldIndex,
        newIndex
      )
    );
  };

  return (
    <div className="sortable-list">

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ids}
          strategy={
            verticalListSortingStrategy
          }
        >
          {steps.map(
            (step, index) => (
              <StepItem
                key={ids[index]}
                id={ids[index]}
                step={step}
                index={index}
                onChange={updateStep}
                onRemove={removeStep}
              />
            )
          )}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        className="add-row-button"
        onClick={addStep}
      >
        + Add Cooking Step
      </button>

    </div>
  );
}

export default StepList;