
import { Provider } from "react-redux";
import AppRouter from "./app/router/AppRouter";
import { store } from "./app/store";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <AppRouter />
        <Toaster 
        position="top-right" 
        toastOptions={{
          style: { background: '#333', color: '#fff' },
          success: { duration: 3000, theme: { primary: '#eab308' } }
        }} 
      />
        
      </div>
    </Provider>
  );
}

export default App;
