
"use client"; 

import React from "react";

type CustomDateProps = {
  date: string | Date; 
};

const CustomDate: React.FC<CustomDateProps> = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return <span>{`${formattedDate} ${formattedTime}`}</span>;
};

export default CustomDate;
