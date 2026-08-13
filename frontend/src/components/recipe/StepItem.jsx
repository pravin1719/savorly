import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function StepItem({
  id,
  step,
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
      className="sortable-item step-item"
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

      <textarea
        value={step.description}
        onChange={(event) =>
          onChange(
            index,
            event.target.value
          )
        }
        placeholder={`Describe cooking step ${
          index + 1
        }`}
        rows={2}
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

export default StepItem;