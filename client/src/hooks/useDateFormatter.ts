import { useMemo } from "react";

type DateInput = string | number | Date | null | undefined;

export const useDateFormatter = () => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    []
  );

  const formatDate = (value: DateInput) => {
    if (!value) return "";

    const parsedDate = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "";

    return formatter.format(parsedDate);
  };

  return { formatDate };
};

