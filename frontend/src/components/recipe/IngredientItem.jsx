import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function IngredientItem({
  id,
  ingredient,
  index,
  onChange,
  onRemove
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="sortable-item"
    >
      <button
        type="button"
        className="drag-handle"
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>

      <span className="item-number">
        {index + 1}
      </span>

      <input
        type="text"
        value={ingredient.name}
        onChange={(event) =>
          onChange(
            index,
            "name",
            event.target.value
          )
        }
        placeholder="Ingredient name"
        required
      />

      <input
        type="text"
        value={ingredient.quantity}
        onChange={(event) =>
          onChange(
            index,
            "quantity",
            event.target.value
          )
        }
        placeholder="Quantity"
        required
      />

      <input
        type="text"
        value={ingredient.unit}
        onChange={(event) =>
          onChange(
            index,
            "unit",
            event.target.value
          )
        }
        placeholder="Unit"
        required
      />

      <button
        type="button"
        className="remove-row-button"
        onClick={() => onRemove(index)}
      >
        ×
      </button>
    </div>
  );
}

export default IngredientItem;