import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating }: { rating: number }) => {
  function getStarCount(num: number) {
    let numberOfStars = Math.ceil(parseFloat(`${num}`));
    if (numberOfStars > 5) numberOfStars = 5;
    const data = new Array(numberOfStars);
    for (let i = 0; i < data.length; i++) {
      data[i] = i;
    }
    return data;
  }

  const stars = getStarCount(rating).map((a: number) => {
    if (!(rating >= a + 1) && rating >= a + 1 - 1) {
      return <FaStarHalfAlt key={a} fill="#ff4500" />;
    } else if (rating >= a + 1) {
      return <FaStar key={a} fill="#ff4500" />;
    }
  });

  return (
    <>
      {rating} {stars}
      {stars.length < 5 &&
        new Array(5 - stars.length)
          .fill(0)
          .map((_, i) => <FaStar key={i} fill="#8d8b89" />)}
    </>
  );
};

export default StarRating;
