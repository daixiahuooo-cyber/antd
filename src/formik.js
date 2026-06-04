import { useFormik } from "formik";
import * as Yap from "yap"

import{FaUser,
    FaEnvelope,
    FaExclamationCircle,
    FaPaperPlane
    } from "react-icon/fa";

export default function FormikFormWithYUP() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: ""
    },
    validationSchema: Yap.object({
      name: Yap.string()
        .min(3, "姓名至少要3個字")
        .max(15, "姓名不能超過15個字") 
        .required("姓名是必填的"),
      email: Yap.string()
        .email("電子郵件格式不正確")
        .required("電子郵件是必填的")
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("表單驗證成功，送出資料：", values);
      alert("送出成功，請看 Console 控制台！");
      resetForm();
    }
    });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="name">Your Name</label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="請輸入姓名"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur} 
        value={formik.values.name}
      />
      {formik.touched.name && formik.errors.name ? (
        <div style={{ color: "red", fontSize: "14px" }}>{formik.errors.name}</div>
      ) : null}
      <label htmlFor="email">Your E-Mail</label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="請輸入電子郵件"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur} 
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div style={{ color: "red", fontSize: "14px" }}>{formik.errors.email}</div>
      ) : null}
      <button type="submit">Submit</button>
    </form>
  );
}