export const formatDate = (currentDate?: string) => {
  if (!currentDate) {
    return "-";
  }

  const date = new Date(currentDate);
  const formatedDate = new Intl.DateTimeFormat("pt-PT").format(date);
  return formatedDate;
};
