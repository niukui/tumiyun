import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';

import createHistory from 'history/createHashHistory';
import { goToManage, getAuthority } from './utils/authority';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';
import '../node_modules/react-dropzone-component/styles/filepicker.css';
import '../node_modules/dropzone/dist/min/dropzone.min.css';
// 1. Initialize
const app = dva({
  history: createHistory(),
});

var a = getAuthority();
if (!a || !a.userId) {
  goToManage();
} 

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
