import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {
  Row,
  Col,
  Card,
  BackTop,
  Spin,
  Divider,
  Carousel,
  Button,
  Icon
} from 'antd';
import numeral from 'numeral';
import {ChartCard, Field} from 'components/Charts';

import './index.less';

const {Meta} = Card;

function PrevArrow(props) {
  const {className, style, onClick} = props;
  return (
    <Button
      className={className}
      style={{
      ...style,
      display: "block",
      background: "green",
      width: "32px",
      height: "32px",
      color: "#fff",
      left: "-32px",
      backgroundColor: " #1890ff",
      borderColor: "#1890ff"
    }}
      onClick={onClick}
      type="primary"
      shape="circle">
      <Icon type="caret-left" style={{
        fontSize: 16
      }}/>
    </Button>
  );
}

function NextArrow(props) {
  const {className, style, onClick} = props;
  return (
    <Button
      className={className}
      style={{
      ...style,
      display: "block",
      background: "green",
      width: "32px",
      height: "32px",
      color: "#fff",
      right: "-32px",
      backgroundColor: " #1890ff",
      borderColor: "#1890ff"
    }}
      onClick={onClick}
      type="primary"
      shape="circle">
      <Icon type="caret-right" style={{
        fontSize: 16
      }}/>
    </Button>
  );
}

@connect(({home, loading}) => ({home, loading: loading.effects['home/fetch']}))
export default class Home extends Component {

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'home/fetch'});
  }

  render() {
    const {loading, home: {
        mainpage
      }} = this.props;

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: {
        marginBottom: 24
      }
    };

    const dashboardItems = (mainpage.dashBoard || []).map((d, key) => {
      if (key === 0) {
        return (
          <Col {...topColResponsiveProps} key={key}>
            <ChartCard
              style={{
              backgroundColor: "#24ACD8"
            }}
              totalStyle={{
              color: '#fff',
              fontSize: '3em',
              fontWeight: 'bold'
            }}
              bordered={true}
              title=""
              total={d.count}
              footer={< Field style = {{backgroundColor: "#24ACD8",color:"#fff"}}label = {
              d.name
            }
            value = "" />}
              contentHeight={46}></ChartCard>
          </Col>
        )
      }
      if (key === 1) {
        return (
          <Col {...topColResponsiveProps} key={key}>
            <ChartCard
              style={{
              backgroundColor: "#66B869"
            }}
              totalStyle={{
              color: '#fff',
              fontSize: '3em',
              fontWeight: 'bold'
            }}
              bordered={true}
              title=""
              total={d.count}
              footer={< Field style = {{backgroundColor: "#66B869",color:"#fff"}}label = {
              d.name
            }
            value = "" />}
              contentHeight={46}></ChartCard>
          </Col>
        )
      }
      if (key === 2) {
        return (
          <Col {...topColResponsiveProps} key={key}>
            <ChartCard
              style={{
              backgroundColor: "#658CA0"
            }}
              totalStyle={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '3em'
            }}
              bordered={true}
              title=""
              total={d.count}
              footer={< Field style = {{backgroundColor: "#658CA0",color:"#fff"}}label = {
              d.name
            }
            value = "" />}
              contentHeight={46}></ChartCard>
          </Col>
        )
      }
    });

    const deliveryQucikStartItems = (mainpage.deliveryQuickStart || []).map((d, key) => <Col {...topColResponsiveProps} key={key}>
      <ChartCard
        totalStyle={{
        fontSize: '1.5em'
      }}
        hoverable
        bordered={true}
        title=""
        total={d.name || d.corpName || d.phoneNumber}
        footer={< Field style = {{backgroundColor:'#fff',fontWeight:'bold'}}label = "ID:" value = {
        d.userId
      } />}
        contentHeight={46}
        onClick={(item) => {
        this
          .props
          .history
          .push("deliver/create/");
      }}
        item={d}></ChartCard>
    </Col>);
    const acceptQuickStartItems = (mainpage.acceptQuickStart || []).map((d, key) => <Col {...topColResponsiveProps} key={key}>
      <ChartCard
        totalStyle={{
        fontSize: '1.5em'
      }}
        hoverable
        bordered={true}
        title=""
        total={d.name || d.corpName || d.phoneNumber}
        footer={< Field style = {{backgroundColor:'#fff',fontWeight:'bold'}}label = "ID:" value = {
        d.userId
      } />}
        contentHeight={46}
        onClick={(item) => {
        this
          .props
          .history
          .push("deliver/details/" + encodeURIComponent(item.taskId));
      }}
        item={d}></ChartCard>
    </Col>);
    const copyRightsViewsItems = (mainpage.copyRightsViews || []).map((d, key) => <div key={key}>
      <div
        style={{
        paddingLeft: "25px",
        paddingRight: "25px",
        height: "280px",
        width: "250px",
        textAlign: "center"
      }}>
        <Card
          hoverable
          cover={< img style = {{ paddingTop: "10px", width: "200px", height: "200px" }}alt = "example" src = {
          d.imgUrl
        } />}>
          <Meta style={{
            textAlign: "center"
          }} title={d.fileName}/>
        </Card>
      </div>
    </div>);

    const copyRightsViewsItemsForCards = (mainpage.copyRightsViews || []).map((d, key) => <Col {...topColResponsiveProps} key={key}>
      <Card
        hoverable
        cover={< img style = {{ paddingTop: "10px", width: "200px", height: "200px" }}alt = "example" src = {
        d.imgUrl
      } />}>
        <Meta style={{
          textAlign: "center"
        }} title={d.fileName}/>
      </Card>
    </Col>);

    const carouselSettings = {
      style: {
        paddingTop: "10px",
        width: "200px",
        height: "200px"
      },
      className: "abc",
      speed: 400,
      slidesToShow: 4,
      slidesToScroll: 4,
      arrows: true,
      nextArrow: <NextArrow/>,
      prevArrow: <PrevArrow/>,
      responsive: [
        {
          breakpoint: 1300,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        }, {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        }, {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

    return (
      <Fragment>
        <Spin spinning={loading}>
          <Row gutter={24}>
            {dashboardItems}
          </Row>
          <Divider style={{
            marginBottom: 32
          }}/>
          <Card title="快速交付">
            <Row gutter={24}>
              {deliveryQucikStartItems}
            </Row>
          </Card>
          <Divider style={{
            marginBottom: 32
          }}/>
          <Card title="快速接收">
            <Row gutter={24}>
              {acceptQuickStartItems}
            </Row>
          </Card>
          <Divider style={{
            marginBottom: 32
          }}/>
          <Card title="版权登记播报">
            {copyRightsViewsItems.length >= 4
              ? <div
                  style={{
                  marginLeft: "16px",
                  marginRight: "16px"
                }}>
                  <Carousel {...carouselSettings}>
                    {copyRightsViewsItems}
                  </Carousel>
                </div>
              : <Row gutter={24}>
                {copyRightsViewsItemsForCards}
              </Row>
}
          </Card>
          <BackTop/>
        </Spin>
      </Fragment>
    );
  }
}
