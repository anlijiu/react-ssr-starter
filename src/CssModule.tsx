// import s from './CssModule.module.css';
import { test as s_test } from './CssModule.module.css';

const CssModule = () => {
  return (
    <p className={s_test}> css module </p>
  );
}

CssModule.defaultProps = {
};

export default CssModule;
