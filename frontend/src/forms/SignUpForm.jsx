// import React from "react";
// import { Button, Checkbox, Col, Flex, Form, Input, Row, Space } from "antd";
// import { UserOutlined, MailOutlined, IdcardOutlined } from "@ant-design/icons";
// import CustomButton from "../components/shared-components/CustomButton";
// import { Typography } from "antd";
// import Link from "antd/es/typography/Link";
// const { Title, Text } = Typography;
// const onFinish = (values) => {
//   console.log("Success:", values);
// };
// const onFinishFailed = (errorInfo) => {
//   console.log("Failed:", errorInfo);
// };
// const boxStyle = {
//   width: "70%",
//   textAlign: "center",
//   // background:"red"
// };
// const SignUpForm = ({setSignInForm,setRotate}) => (
  
//   <Row style={{ width: "100%" }}>
//     <Flex style={boxStyle} justify="center" align="center">
//       <Col>
//         <Space direction="vertical" size={0}>
//           <Title>Sign Up</Title>
//           <Text style={{fontSize:"1.1rem", color:"#5D5D5B"}} >Start by entering your information</Text>
//         </Space>
//       </Col>
//     </Flex>

//     <Form
//       layout="vertical"
//       name="login"
//       style={{
//         width: "70%",
//         marginTop: "1%",
//       }}
//       initialValues={{
//         remember: true,
//       }}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//       autoComplete="off"
//     >
//       <Form.Item
//         name="fullname"
//         label="Fullname"
//         rules={[
//           {
//             required: true,
//             message: "Please input your fullname!",
//             whitespace: true,
//           },
//         ]}
//       >
//         <Input size="large" suffix={<IdcardOutlined />} />
//       </Form.Item>

//       <Form.Item
//         name="email"
//         label="E-mail"
//         rules={[
//           {
//             type: "email",
//             message: "The input is not valid E-mail!",
//           },
//           {
//             required: true,
//             message: "Please input your E-mail!",
//           },
//         ]}
//       >
//         <Input size="large" suffix={<MailOutlined />} />
//       </Form.Item>
//       <Form.Item
//         label="Username"
//         name="username"
//         rules={[
//           {
//             required: true,
//             message: "Please input your username!",
//           },
//           ({ getFieldValue }) => ({
//             validator(_, value) {
//               if (!value || getFieldValue("username").length >= 5) {
//                 return Promise.resolve();
//               }
//               return Promise.reject(
//                 new Error("username length should not less than 5")
//               );
//             },
//           }),
//         ]}
//         hasFeedback
//       >
//         <Input size="large" suffix={<UserOutlined />} />
//       </Form.Item>

//       <Form.Item
//         name="password"
//         label="Password"
//         rules={[
//           {
//             required: true,
//             message: "Please input your password!",
//           },
//         ]}
//         hasFeedback
//       >
//         <Input.Password size="large" />
//       </Form.Item>

//       <Form.Item
//         name="confirm"
//         label="Confirm Password"
//         dependencies={["password"]}
//         hasFeedback
//         rules={[
//           {
//             required: true,
//             message: "Please confirm your password!",
//           },
//           ({ getFieldValue }) => ({
//             validator(_, value) {
//               if (!value || getFieldValue("password") === value) {
//                 return Promise.resolve();
//               }
//               return Promise.reject(
//                 new Error("The new password that you entered do not match!")
//               );
//             },
//           }),
//         ]}
//       >
//         <Input.Password size="large" />
//       </Form.Item>

//       <Form.Item name="remember" valuePropName="checked">
//         <Checkbox size="middle">
//           By signing up, you agree to our Terms and Privacy Policy.
//         </Checkbox>
//       </Form.Item>

//       <Form.Item>
//         <CustomButton title="Get Started" />
//       </Form.Item>
//     </Form>

//     <Flex style={boxStyle} justify="center" align="center">
//     <Space direction="vertical" size={0}>
//               <Text style={{ fontSize: "1.1rem", color: "#5D5D5B" }}>
//                 Already a user? Sign in now
//                 <Link
//                   onClick={() => {setSignInForm(false);setRotate(false)}}
//                   style={{ fontSize: "1.1rem", color: "#5D5D5B" }}
//                 >
//                   Sign In
//                 </Link>
//               </Text>
//             </Space>
//     </Flex>
//   </Row>
// );
// export default SignUpForm;
