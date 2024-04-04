import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Tooltip,
  message,
  Button,
  Space,
  Image,
  Avatar,
  Modal,
  Carousel,
  Input,
  Col,
} from 'antd';
import {
  EyeOutlined,
  CloseOutlined,
  CheckOutlined,
  RedoOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import socketio from 'socket.io-client';
import axios from 'axios';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const RequestServiceList = (props) => {
  const { TextArea } = Input;
  const { t, i18n } = useTranslation();
  console.log(i18n);
  //   console.log(props, 'props');
  //   let {t} = i18next
  const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL);
  const token = localStorage.getItem('auth_token');
  const userData = JSON.parse(localStorage.getItem('user_data'));
  const isAdminViewer = userData.role === 'adminViewer';
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [rejectReasonOpen, setRejectReasonOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState({
    rejectReasonField: null,
    rejectReasonDescription: null,
  });
  const [acceptButtonLoading, setAcceptButtonLoading] = useState({});
  const [rejectButtonLoading, setRejectButtonLoading] = useState({});
  const [rejectRequestData, setRejectRequestData] = useState({});
  const columns = [
    {
      title: t('image'),
      dataIndex: 'appearanceImage',
      key: 'appearanceImage',
      render: (text, record) => (
        <>
          {/* {console.log(text[0], 'uyuituytuytuy')} */}
          <Avatar
            src={`${process.env.REACT_APP_BASE_URL}/${text[0]}`}
            alt='img'
          />
        </>
      ),
    },
    {
      title: t('name'),
      dataIndex: 'stallionName',
      key: 'stallionName',
    },
    {
      title: t('age'),
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('color'),
      key: 'color',
      dataIndex: 'color',
    },
    {
      title: t('strain'),
      key: 'strain',
      dataIndex: 'strain',
    },
    {
      title: t('actions'),
      render: (_, record) => (
        <Space
          className={localStorage.getItem('language') === 'ar' ? 'rtl' : ''}
          size='middle'
        >
          <Button
            style={{ cursor: 'pointer' }}
            onClick={() => {
              showModal(record);
            }}
          >
            <EyeOutlined />
          </Button>
          {!isAdminViewer && (
            <Tooltip title='Delete'>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  deleteRequest(record);
                }}
                size='small'
              />
            </Tooltip>
          )}
          {isAdminViewer && record.requestStatus === 'pending' ? (
            <Tag color='warning'>{t('pending')}</Tag>
          ) : record.requestStatus === 'pending' ? (
            <>
              <Button
                style={{ cursor: 'pointer' }}
                type='primary'
                loading={record._id && acceptButtonLoading[record._id]}
                onClick={() => acceptRequest(record)}
              >
                <CheckOutlined />
              </Button>
              <Button
                style={{ cursor: 'pointer' }}
                danger
                loading={record._id && rejectButtonLoading[record._id]}
                onClick={() => {
                  setRejectReasonOpen(true);
                  setRejectRequestData(record);
                }}
              >
                <CloseOutlined />
              </Button>
            </>
          ) : record.requestStatus === 'accepted' ? (
            <Tag color='success'>{t('accepted')}</Tag>
          ) : (
            <Tag color='error'>{t('rejected')}</Tag>
          )}
        </Space>
      ),
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <div>
    //       <button type='button'>
    //         <EyeOutlined />
    //       </button>
    //     </div>
    //   ),
    // },
  ];
  const modalColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
  ];
  const d = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const contentStyle = {
    margin: '0 auto',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  const showModal = (record) => {
    setModalOpen(true);
    setModalData(record);
  };
  const acceptRequest = async (record) => {
    try {
      setAcceptButtonLoading({
        [record._id]: true,
      });

      let payload = {
        mattingRequestId: record._id,
      };
      let socketPayload = {
        senderId: userData._id,
        receiverId: record.addedBy._id,
        rejectReason: null,
        requestId: record._id,
      };
      let response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/matting/acceptMattingRequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(socketPayload, payload);
      socket.emit('get-notification', socketPayload);
      fetchData();
      setAcceptButtonLoading({
        [record._id]: false,
      });
    } catch (error) {
      setAcceptButtonLoading({
        [record._id]: false,
      });
      console.log(error, 'error');
    }
  };

  const rejectRequest = async () => {
    try {
      setRejectButtonLoading({
        [rejectRequestData._id]: true,
      });
      let payload = {
        mattingRequestId: rejectRequestData._id,
        rejectReason: rejectReason,
      };
      let socketPayload = {
        senderId: userData._id,
        receiverId: rejectRequestData.addedBy._id,
        rejectReason,
        requestId: rejectRequestData._id,
      };
      console.log(socketPayload);
      let response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/matting/deniedMattingRequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      socket.emit('get-notification', socketPayload);
      fetchData();
      setRejectReasonOpen(false);
      setRejectButtonLoading({
        [rejectRequestData._id]: false,
      });
    } catch (error) {
      setRejectButtonLoading({
        [rejectRequestData._id]: false,
      });
      console.log(error, 'error');
    }
  };
  const fetchData = async () => {
    try {
      const request = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/matting/getAllMattingRequest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(request);
      if (request.data.data) {
        setData(request.data.data);
      }
    } catch (e) {
      console.error(e, 'error in fetching data');
    }
  };

  const deleteRequest = async (record) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/matting/deleteMattingRequest?requestId=${record._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
      toast.success('request deleted successfully');
    } catch (e) {
      toast.error('Error while deleting request');
      console.log('error', e);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          // marginLeft: '10px',
        }}
      >
        <h2>{t('request services list')}</h2>
        <Button onClick={() => fetchData()}>
          <RedoOutlined />
        </Button>
      </div>
      <Card bodyStyle={{ padding: '0px' }}>
        <div className='table-responsive'>
          <Table columns={columns} dataSource={data} />
        </div>
      </Card>
      <Modal
        title={`${modalData?.stallionName}${t(`'s details`)}`}
        centered
        visible={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <div
          className='hide-scrollbar'
          style={{ height: '600px', overflowY: 'scroll', overflowX: 'hidden' }}
        >
          <div>
            <h2>{t('stallion details')}</h2>
            <hr />
          </div>
          <div>
            <h4>{`${t('appearance image')} :`}</h4>
            <Carousel arrows={true} autoplay>
              {modalData &&
                modalData.appearanceImage &&
                modalData.appearanceImage.map((item, index) => (
                  <div>
                    <img
                      style={contentStyle}
                      src={`${process.env.REACT_APP_BASE_URL}/${item}`}
                      alt='appearanceImage'
                      key={index}
                    />
                  </div>
                ))}
            </Carousel>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={8}>
              <h4>{t('stallion description')} :</h4>
            </Col>
            <Col span={16}>
              <p>{modalData?.stallionDescription}</p>
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={8}>
              <h4>{t('stallion type')} :</h4>
            </Col>
            <Col span={16}>
              <p>{modalData?.type}</p>
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={8}>
              <h4>{'stallion colour'} :</h4>
            </Col>
            <Col span={16}>
              <p>{modalData?.color}</p>
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={8}>
              <h4>{t('stallion age')} :</h4>
            </Col>
            <Col span={16}>
              <p>{modalData?.age}</p>
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={8}>
              <h4>{t('awards owned')} :</h4>
            </Col>
            <Col span={16}>
              <p>{modalData?.awards}</p>
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={10}>
              <h4>{t('strike days per week')} :</h4>
            </Col>
            <Col span={14}>
              <p>{modalData?.strikeDaysPerWeek.join(', ')}</p>
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={12}>
              <h4>{t('number of strike per day')} :</h4>
            </Col>
            <Col span={12}>
              <p>{modalData?.numberOfStrikePerDay}</p>
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={10}>
              <h4>{t('available times per day')} :</h4>
            </Col>
            <Col span={14}>
              {modalData?.availableTimesPerDay.toString().replaceAll(',', ', ')}
              {/* {modalData?.bookSlots ? (
                <p>{modalData?.bookSlots.toString().replaceAll(',', ', ')}</p>
              ) : (
                <p>no booked slots.</p>
              )} */}
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={10}>
              <h4>{t('booked slots')} :</h4>
            </Col>
            <Col span={14}>
              {modalData?.bookSlots ? (
                modalData.bookSlots.map((item, index) => {
                  return (
                    <p key={index}>
                      {`${new Date(item.date).toDateString()} at ${item.time}`}
                    </p>
                  );
                })
              ) : (
                <p>{t('no booked slots')}</p>
              )}
              {/* <p>{modalData?.bookSlots ? () : 'no booked slots.'}</p> */}
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={10}>
              <h4>{t('medical examination')} :</h4>
            </Col>
            <Col span={14}>
              <p>{modalData?.medicalExamination}</p>
            </Col>
          </div>
          {/* <Table bordered columns={modalColumns} dataSource={d} /> */}
          <div>
            <h4>{t('production pictures')} :</h4>
            <Carousel arrows={true} autoplay>
              {modalData &&
                modalData.productionPicture &&
                modalData.productionPicture.map((item, index) => (
                  <div>
                    <img
                      style={contentStyle}
                      src={item}
                      alt='ProductionPicture'
                      key={index}
                    />
                  </div>
                ))}
            </Carousel>
          </div>
          <div>
            <h4>{t('appearance video')} :</h4>
            <div style={{ display: 'flex' }}>
              {modalData && modalData.appearanceVideo && (
                <video
                  width={450}
                  src={modalData.appearanceVideo}
                  controls
                ></video>
              )}
            </div>
          </div>
          <div>
            <h2>{t('stallion owner details')}</h2>
            <hr />
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={10}>
              <h4>{t('owner name')}</h4>
            </Col>
            <Col span={14}>
              <p>{modalData?.ownerName}</p>
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={10}>
              <h4>{t('owner phone')}</h4>
            </Col>
            <Col span={14}>
              <a href={`tel:${modalData?.ownerPhoneNumber}p000`}>
                {modalData?.ownerPhoneNumber}
              </a>
            </Col>
          </div>
          <div style={{ display: 'flex' }}>
            <Col span={10}>
              <h4>{t('owner email')}</h4>
            </Col>
            <Col span={14}>
              <a href={`mailto:${modalData?.ownerEmail}`}>
                {modalData?.ownerEmail}
              </a>
            </Col>
          </div>
        </div>
      </Modal>
      <Modal
        title={'Reject Reason'}
        centered
        visible={rejectReasonOpen}
        onOk={() => rejectRequest()}
        onCancel={() => setRejectReasonOpen(false)}
        footer={[
          <Button key='back' onClick={() => setRejectReasonOpen(false)}>
            Return
          </Button>,
          <Button key='submit' type='primary' onClick={() => rejectRequest()}>
            Submit
          </Button>,
        ]}
      >
        <div style={{ marginBottom: '0.5rem' }}>
          <h5>Reject reason field</h5>
          <Input
            name='rejectReasonField'
            onChange={(e) =>
              setRejectReason((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            placeholder='Enter request reject field'
          />
        </div>
        <div>
          <h5>Reject reason field description</h5>
          <TextArea
            name='rejectReasonDescription'
            onChange={(e) =>
              setRejectReason((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            rows={4}
            placeholder='Enter request reject reason...'
          />
        </div>
      </Modal>
    </>
  );
};

export default RequestServiceList;
