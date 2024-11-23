import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 300_000,
      staleTime: 10 * 1000,
      retry: 3,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <App /> */}
      <RouterProvider router={router} />
      <a
        href="https://wa.me/919110736115"
        className="d-flex justify-content-center align-items-center"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25d366',
          color: '#fff',
          borderRadius: '50%',
          zIndex: 100,
          width: 'calc(2rem + 2vw)', // Equal width and height for a perfect circle
          height: 'calc(2rem + 2vw)', // Equal width and height for a perfect circle
          boxShadow: '2px 2px 3px #999',
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i
          className="bi bi-whatsapp"
          style={{
            fontSize: 'calc(1.5rem + 1vw)', // Responsive font size
          }}
        ></i>
      </a>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
