import React from 'react';
import { Card, Spin } from 'antd';
import classNames from 'classnames';

import styles from './index.less';

const renderTotal = (total,totalStyle) => {
  let totalDom;
  switch (typeof total) {
    case 'undefined':
      totalDom = null;
      break;
    case 'function':
      totalDom = <div style={totalStyle} className={styles.total}>{total()}</div>;
      break;
    default:
      totalDom = <div style={totalStyle} className={styles.total} >{total}</div>;
  }
  return totalDom;
};

const ChartCard = ({
  loading = false,
  contentHeight,
  title,
  avatar,
  action,
  total,
  footer,
  children,
  hoverable,
  onClick,
  item,
  totalStyle,
  ...rest
}) => {
  const content = (
    <div onClick={()=>{return onClick && onClick(item);}} className={styles.chartCard + " " + (hoverable ? styles.chartCardHoverable : "")}>
      <div
        className={classNames(styles.chartTop, {
          [styles.chartTopMargin]: !children && !footer,
        })}
      >
        <div className={styles.metaWrap} >
          {renderTotal(total,totalStyle)}
        </div>
      </div>
      {children && (
        <div className={styles.content} style={{ height: contentHeight || 'auto' }}>
          <div className={contentHeight && styles.contentFixed}>{children}</div>
        </div>
      )}
      {footer && (
        <div
          className={classNames(styles.footer, {
            [styles.footerMargin]: !children,
          })}
          style={{background:"#FAFAFA"}}
        >
          {footer}
        </div>
      )}
    </div>
  );

  return (
    <Card bodyStyle={{ padding: '20px 24px 8px 24px' }} {...rest}>
      {
        <Spin spinning={loading} wrapperClassName={styles.spin}>
          {content}
        </Spin>
      }
    </Card>
  );
};

export default ChartCard;
