import { safeJSONParse } from "@/utils/datatable";
import { TagsProps } from "./Tags.types";
import Tag from "../../../tag/Tag";

const TagsBase = ({ item, value }: TagsProps) => {
  let tags = value;
  if (typeof value === "string") {
    tags = safeJSONParse(value);
  }

  // Ensure tags is always treated as an iterable array
  let tagEntries;

  if (Array.isArray(tags)) {
    tagEntries = tags.map((tag) => [null, tag]);
  } else if (typeof tags === "object" && tags !== null) {
    tagEntries = Object.entries(tags);
  } else {
    tagEntries = [];
  }

  // Function to determine what to display in the tag
  const renderTagContent = (entry) => {
    if (entry && typeof entry === "object") {
      return `${entry.duration} ${entry.timeframe}`;
    } else if (typeof entry === "object" && entry !== null) {
      return JSON.stringify(entry);
    }
    return entry;
  };

  return (
    <div className="card-dashed">
      <p className="text-sm mb-2 text-muted-400 dark:text-muted-600">
        {item.label || item.name}
      </p>
      <div className="flex flex-wrap gap-2">
        {tagEntries.map(([, value], index) => {
          const content = renderTagContent(value);
          return (
            <Tag key={index} variant="outlined" shape="smooth" color="default">
              {content}
            </Tag>
          );
        })}
      </div>
    </div>
  );
};

export const Tags = TagsBase;
