import { useCallback, useEffect, useState } from "react";
import { IoMdStar } from "react-icons/io";

const StarRatingHover = ({
  length = 5,
  existRating,
  handleClick,
}: {
  length: number;
  existRating: number;
  handleClick: any;
}) => {
  const [color, setColor] = useState(Array(length).fill("gray"));
  const [selectedColor, setSelectedColor] = useState(
    existRating ? new Array(existRating) : []
  );

  const mouseLeave = () => {
    if (!selectedColor.length) {
      const newColor = color.map(() => "gray");
      setColor(newColor);
    }
  };
  const mouseEnter = (e: any, id: number) => {
    const newColor = color.map((_, index) => {
      if (index <= id) return "red";
    });
    setColor(newColor);
  };
  const selected = (e: any, id: number) => {
    if (id !== existRating) {
      const newColor: any = color.map((_, index) => {
        if (index <= id + 1) return "red";
      });
      setSelectedColor(newColor);
    }
    handleClick(id);
  };

  const initialSelected = useCallback(
    (e: any, id: number) => {
      const newColor: any = color.map((_, index) => {
        if (index + 1 <= id) return "red";
      });
      setSelectedColor(newColor);
    },
    [color, setSelectedColor]
  );

  useEffect(() => {
    initialSelected(null, existRating);
  }, [existRating, initialSelected]);

  return (
    <div>
      {color.map((color, index) => (
        <IoMdStar
          key={index}
          size={20}
          fill={!selectedColor.length ? color : selectedColor[index]}
          onMouseEnter={(e: any, id = index) => mouseEnter(e, id)}
          onMouseLeave={mouseLeave}
          onClick={(e: any, id = index + 1) => selected(e, id)}
        />
      ))}
    </div>
  );
};
export default StarRatingHover;
