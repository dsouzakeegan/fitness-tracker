// import React, { useState } from "react";
// import { Col, Flex, Image, Row, Button, Card, Typography, Space } from "antd";
// import LeadGenius from "../assets/images/lead-genius-login.png";
// import SignUpForm from "../forms/SignUpForm.jsx";
// import LoginForm from "../forms/LoginForm.jsx";
// import Link from "antd/es/typography/Link.js";

// const { Text } = Typography;
// const fullHeightStyle = {
//   height: "100vh",
// };

// const boxStyle = {
//   width: "100%",
//   height: "100%",
//   flexDirection: "column",
//   // textAlign:"left"
// };

// function LoginComponent() {
//   const [signInForm, setSignInForm] = useState(false);
//   const [rotate, setRotate] = useState(false);

//   return (
//     <Row style={fullHeightStyle}>
//       <Col span={12}>
//         <Flex style={boxStyle} justify="center" align="center">
//           <Image preview={false} src={LeadGenius} />
//         </Flex>
//       </Col>

//       <Col span={12}>
//         <Flex style={boxStyle} justify="center" align="center">
//           {signInForm ? <SignUpForm setSignInForm={setSignInForm} /> : <LoginForm setSignInForm={setSignInForm} />}
//           {/* <Card
//             style={{
//               width: "80%",
//               height: "80%",
//               position: "relative",
//               // transform: rotate ? "rotateY(0deg)" : "rotateY(180deg)",
//               transition: "transform 0.5s",
//               transformStyle: "preserve-3d", // Necessary for the flip effect
//             }}
//             hoverable
//           >
//              <Card
//              bordered={false}
//               style={{
//                 position: "absolute",
//                 width: "100%",
//                 height: "100%",
//                 backfaceVisibility: "hidden",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "20px",
//                 // transform: rotate ? "rotateY(0deg)" : "rotateY(180deg)"
//               }}
//             >
              
//               {!rotate  ? <LoginForm setSignInForm={setSignInForm} setRotate={setRotate} /> : <SignUpForm setRotate={setRotate} setSignInForm={setSignInForm} />}
//             </Card>
      
//           </Card> */}
//           {/* <Button
//             onClick={() => setRotate(!rotate)}
//             style={{ marginTop: "20px" }}
//           >
//             Click to Rotate
//           </Button> */}
//         </Flex>
//       </Col>
//     </Row>
//   );
// }

// export default LoginComponent;
