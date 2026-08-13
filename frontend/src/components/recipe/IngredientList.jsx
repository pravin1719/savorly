import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

import IngredientItem from "./IngredientItem";

function IngredientList({
  ingredients,
  onChange
}) {
  const ids = ingredients.map(
    (_, index) => `ingredient-${index}`
  );

  const addIngredient = () => {
    onChange([
      ...ingredients,
      {
        name: "",
        quantity: "",
        unit: ""
      }
    ]);
  };

  const updateIngredient = (
    index,
    field,
    value
  ) => {
    const updatedIngredients = [
      ...ingredients
    ];

    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value
    };

    onChange(updatedIngredients);
  };

  const removeIngredient = (index) => {
    if (ingredients.length === 1) {
      return;
    }

    onChange(
      ingredients.filter(
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
        ingredients,
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
          {ingredients.map(
            (ingredient, index) => (
              <IngredientItem
                key={ids[index]}
                id={ids[index]}
                ingredient={ingredient}
                index={index}
                onChange={updateIngredient}
                onRemove={removeIngredient}
              />
            )
          )}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        className="add-row-button"
        onClick={addIngredient}
      >
        + Add Ingredient
      </button>

    </div>
  );
}

export default IngredientList;