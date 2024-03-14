import './App.css';
import FormComponent from "./FormComponent/FormComponent";

function App() {
  return (
    /* 
      I'm using Tailwindcss to style the Form, but it can be done so many ways,
      using a component library, using a css solution such as bootstrap, styled components, emotion, tailwindcss, etc
    */
    <div className='w-3/4 mx-auto'>
      <FormComponent />
    </div>
  );
}

export default App;
