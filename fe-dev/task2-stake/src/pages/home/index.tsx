import { toast } from "react-toastify";

const Home = () => {
  return (
    <button
      onClick={() => {
        toast("I am a toast");
        toast.info("I am a toast");
        toast.warn("I am a toast");
        toast.error("I am a toast");
      }}
    >
      I am a home component
    </button>
  );
};

export default Home;
