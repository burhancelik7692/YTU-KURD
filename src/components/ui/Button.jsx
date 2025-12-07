import React from "react";

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={className}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
