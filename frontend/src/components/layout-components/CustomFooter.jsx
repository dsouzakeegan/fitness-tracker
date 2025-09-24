import { Footer } from 'antd/es/layout/layout'
import React from 'react'

const footerStyle = {
    textAlign: "center",
    color: "#000",
    backgroundColor: "#E9E9E9",
    height: 64,
  };

function CustomFooter() {
  return (
    <Footer style={footerStyle}>Footer</Footer>
  )
}

export default CustomFooter