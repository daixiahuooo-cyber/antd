import { useFormik } from "formik";
import { AiFillAndroid } from "react-icons/ai";
import { AiFillApple } from "react-icons/ai";

export default function SimpleForm() {
  // 1. 【啟動引擎】在這裡初始化 useFormik，把驗證邏輯與送出動作寫進去
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "姓名是必填的";
      } else if (values.name.length > 15) {
        errors.name = "姓名不能超過15個字";
      } 
      if (!values.email) {
        errors.email = "電子郵件是必填的";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "電子郵件格式不正確";
      }
      return errors;
    },
    onSubmit: (values) => {
      // 只有當上面驗證完全沒問題時，這裡才會執行
      console.log("表單成功送出！資料如下：", values);
      alert("送出成功，請看 Console 控制台！");
    },
  });

  return (
    // 2. 【接上方向盤】必須把 formik.handleSubmit 綁定給 form 的 onSubmit
    <form onSubmit={formik.handleSubmit}>
      
      {/* --- 姓名欄位 --- */}
      <label htmlFor="name">Your Name</label>
      <input
        type="text"
        id="name"
        name="name"                   // 👈 必須有 name
        onChange={formik.handleChange} // 👈 必須綁定監聽
        onBlur={formik.handleBlur}     // 👈 必須監聽離開（用來判斷觸碰過沒）
        value={formik.values.name}     // 👈 必須綁定數值
        autoComplete="name"
      />
      {/* 3. 【儀表板提示】必須在畫面上寫這行，錯誤訊息才會顯示出來 */}
      {formik.touched.name && formik.errors.name ? (
        <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}><AiFillAndroid />{formik.errors.name}</div>
      ) : null}

      <br />

      {/* --- 信箱欄位 --- */}
      <label htmlFor="email">Your E-Mail</label>
      <input
        type="email"
        id="email"
        name="email"                  // 👈 必須有 name
        onChange={formik.handleChange} // 👈 必須綁定監聽
        onBlur={formik.handleBlur}     // 👈 必須監聽離開
        value={formik.values.email}    // 👈 必須綁定數值
        autoComplete="email"
      />
      {/* 3. 【儀表板提示】必須在畫面上寫這行，錯誤訊息才會顯示出來 */}
      {formik.touched.email && formik.errors.email ? (
        <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}><AiFillApple />{formik.errors.email}</div>
      ) : null}

      <br />
      <button type="submit">Submit</button>
    </form>
  );
}