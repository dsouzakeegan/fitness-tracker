// import React from "react";
// import { Button, Checkbox, Col, Flex, Form, Input, Row, Space } from "antd";
// import { UserOutlined, MailOutlined, IdcardOutlined } from "@ant-design/icons";
// import CustomButton from "../components/shared-components/CustomButton";
// import { Typography } from "antd";
// import Link from "antd/es/typography/Link";
// import { useDispatch } from "react-redux";
// import { loginUser } from "../store/slices/authSlice";
// import { useNavigate } from "react-router-dom";
// const { Title, Text } = Typography;

// const boxStyle = {
//   width: "70%",
//   textAlign: "center",
//   // background:"red"
// };
// const LoginForm = ({ setSignInForm, setRotate }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const onFinish = async (values) => {
//     try {
//       const response = await dispatch(loginUser(values));
//       console.log(response, "response");
      
//       //response?.payload?.status === true && navigate("/dashboard");
//       response?.payload?.status !== true &&
//         console.error("Login failed:", response?.message);
//     } catch (error) {
//       console.error("An error occurred: ", error);
//     }
//   };
//   const onFinishFailed = (errorInfo) => {
//     console.log("Failed:", errorInfo);
//   };

//   return (
//     <Row style={{ width: "100%" }}>
//       <Flex style={boxStyle} justify="center" align="center">
//         <Col>
//           <Space direction="vertical" size={0}>
//             <Title>Sign In</Title>

//             <Text style={{ fontSize: "1.1rem", color: "#5D5D5B" }}>
//               {/* Start by entering your information */}
//             </Text>
//           </Space>
//         </Col>
//       </Flex>

//       <Form
//         layout="vertical"
//         name="login"
//         style={{
//           width: "70%",
//           marginTop: "1%",
//         }}
//         initialValues={{
//           remember: true,
//         }}
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//         autoComplete="off"
//       >
//         <Form.Item
//           name="email"
//           label="E-mail"
//           rules={[
//             {
//               type: "email",
//               message: "The input is not valid E-mail!",
//             },
//             {
//               required: true,
//               message: "Please input your E-mail!",
//             },
//           ]}
//         >
//           <Input size="large" suffix={<MailOutlined />} />
//         </Form.Item>

//         <Form.Item
//           name="password"
//           label="Password"
//           rules={[
//             {
//               required: true,
//               message: "Please input your password!",
//             },
//           ]}
//           hasFeedback
//         >
//           <Input.Password size="large" />
//         </Form.Item>

//         <Form.Item>
//           <CustomButton title="Sign In" />
//         </Form.Item>
//       </Form>

//       <Flex style={boxStyle} justify="center" align="center">
//         <Col>
//           <Space direction="vertical" size={0}>
//             <Text style={{ fontSize: "1.1rem", color: "#5D5D5B" }}>
//               Not Registered? Sign up now
//               <Link
//                 onClick={() => {
//                   setSignInForm(true);
//                   setRotate(true);
//                 }}
//                 style={{ fontSize: "1.1rem", color: "#5D5D5B" }}
//               >
//                 Sign Up
//               </Link>
//             </Text>
//           </Space>
//         </Col>
//       </Flex>
//     </Row>
//   );
// };
// export default LoginForm;
