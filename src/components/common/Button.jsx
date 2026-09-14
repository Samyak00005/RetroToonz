import { forwardRef } from "react";

const VARIANT_CLASS = {
  primary: "rt-button-primary",
  secondary: "rt-button-secondary",
  ghost: "rt-button-ghost",
  danger: "rt-button-danger",
};

const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "secondary",
    className = "",
    type,
    ...props
  },
  ref,
) {
  const resolvedType = Component === "button" ? type || "button" : type;

  return (
    <Component
      ref={ref}
      type={resolvedType}
      className={`rt-button ${VARIANT_CLASS[variant] || VARIANT_CLASS.secondary} ${className}`.trim()}
      {...props}
    />
  );
});

export default Button;
