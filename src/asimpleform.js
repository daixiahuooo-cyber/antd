import { useFormik } from "formik";

 
export default function SimpleForm() {
return (
    <form>
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" />
        <label htmlFor="email">Your E-Mail</label>
        <input type="email" id="email" />
        <button type="submit">Submit</button>
    </form>
);
};