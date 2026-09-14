import { forwardRef } from "react";

const IconButton = forwardRef(function IconButton(
  { as: Component = "button", className = "", type, ...props },
  ref,
) {
  const resolvedType = Component === "button" ? type || "button" : type;

  return (
    <Component
      ref={ref}
      type={resolvedType}
      className={`rt-icon-button ${className}`.trim()}
      {...props}
    />
  );
});

export default IconButton;
