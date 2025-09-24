import { createStyles } from "antd-style";
import { Button } from "antd";

const buttonStyle = {
  backgroundColor: "#0AEC27",
  color: "white",
  padding: "10px 20px",
  width: "100%",
  border: "none", // You might want to override default Ant Design styles
};

function CustomButton({ title, onClick,icon, ...props }) {
  return (
    <Button
    htmlType="submit"
      type="primary"
      size="large"
      icon={icon}
      onClick={onClick}
      style={buttonStyle}
      {...props}
    >
      {title}
    </Button>
  );
}

export default CustomButton;
