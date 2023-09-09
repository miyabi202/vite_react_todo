import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//export default資料需要與GITHUB的ＲＥＰＯ名稱需要一致（ vite_react_todo)

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/vite_react_todo/' : '/',
  plugins: [react()],
});
