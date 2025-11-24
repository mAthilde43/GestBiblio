export const NextArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", color: "blue", fontSize: "30px" }}
      onClick={onClick}
    />
  );
};

export const PrevArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", color: "blue", fontSize: "30px" }}
      onClick={onClick}
    />
  );
};
