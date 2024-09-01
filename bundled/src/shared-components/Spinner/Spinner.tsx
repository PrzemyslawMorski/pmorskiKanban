import React from "react";

interface ISpinnerProps {
  fontSize?: string;
}

export const Spinner: React.FC<ISpinnerProps> = (props) => {
  return (
    <div className="w3-container w3-center">
      <p>
        <i
          className="fa fa-spinner w3-spin"
          style={{
            fontSize: props.fontSize !== undefined ? props.fontSize : "64px",
          }}
        />
      </p>
    </div>
  );
};
